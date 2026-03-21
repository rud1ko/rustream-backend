import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import {
	type CreateIngressOptions,
	IngressAudioEncodingPreset,
	IngressInput,
	IngressVideoEncodingPreset,
} from 'livekit-server-sdk'

import type { User } from '@/prisma/generated/client'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { LiveKitService } from '../../libs/live-kit/live-kit.service'

@Injectable()
export class IngressService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly liveKitService: LiveKitService,
	) {}

	public async create(user: User, ingressType: IngressInput) {
		await this.resetIngresses(user)

		const options: CreateIngressOptions = {
			name: user.username,
			roomName: user.id,
			participantName: user.username,
			participantIdentity: user.id,
		}

		if (ingressType === IngressInput.WHIP_INPUT) {
			options.bypassTranscoding = true
		} else {
			options.video = {
				source: 1,
				preset: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
			}
			options.audio = {
				source: 2,
				preset: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
			}
		}

		const ingress = await this.liveKitService.ingressClient.createIngress(
			ingressType,
			options,
		)

		if (!ingress || !ingress.url || !ingress.streamKey) {
			throw new BadRequestException('Не удалось создать входной поток')
		}

		await this.prismaService.stream.update({
			where: {
				userId: user.id,
			},
			data: {
				ingressId: ingress.ingressId,
				serverUrl: ingress.url,
				streamKey: ingress.streamKey,
			},
		})

		return true
	}

	private async resetIngresses(user: User) {
		const ingresses = await this.liveKitService.ingressClient.listIngress({
			roomName: user.id,
		})

		const rooms = await this.liveKitService.roomService.listRooms([user.id])

		for (const room of rooms) {
			await this.liveKitService.roomService.deleteRoom(room.name)
		}

		for (const ingress of ingresses) {
			if (ingress.ingressId) {
				await this.liveKitService.ingressClient.deleteIngress(ingress.ingressId)
			}
		}
	}

	public async cleanAllIngressesForcefully() {
		try {
			// Получаем ВСЕ ингрессы (без фильтрации по пользователю)
			const ingresses = await this.liveKitService.ingressClient.listIngress();
			
			if (ingresses.length === 0) {
				return false
			}

			// Удаляем все ингрессы
			const deletePromises = ingresses.map(ingress => 
				this.liveKitService.ingressClient.deleteIngress(ingress.ingressId)
			);

			await Promise.allSettled(deletePromises);

			// Получаем все уникальные комнаты из ингрессов
			const roomNames = [...new Set(ingresses.map(i => i.roomName).filter(Boolean))];
			
			// Удаляем все комнаты
			const deleteRoomPromises = roomNames.map(roomName => 
				this.liveKitService.roomService.deleteRoom(roomName)
			);
			
			await Promise.allSettled(deleteRoomPromises);

			// Очищаем данные в БД - обнуляем ingressId у всех стримов
			await this.prismaService.stream.updateMany({
				data: {
					ingressId: null,
					serverUrl: null,
					streamKey: null,
				},
			});

			return true
		} catch (error) {
			throw new InternalServerErrorException(
				`Ошибка при очистке ингрессов: ${error.message}`,
			);
		}
	}
}
