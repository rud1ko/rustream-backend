import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'

import { User } from '@/prisma/generated/client'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { CreateChannelTargetInput } from './inputs/create-target.input'

@Injectable()
export class TargetService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findAllByChannelId(user: User) {
		const targets = await this.prismaService.channelTarget.findMany({
			where: {
				channelId: user.id,
			},
		})

		return targets
	}

	public async create(user: User, input: CreateChannelTargetInput) {
		const { type, value } = input

		if (!value) {
			throw new ConflictException(
				'Нельзя создать нулевую или отрицательную цель',
			)
		}

		await this.prismaService.channelTarget.create({
			data: {
				type,
				value,
				channel: {
					connect: {
						id: user.id,
					},
				},
			},
		})

		return true
	}

	public async remove(user: User, targetId: string) {
		const channelTarget = await this.prismaService.channelTarget.findUnique({
			where: {
				id: targetId,
			},
		})

		if (!channelTarget) {
			throw new NotFoundException('Цель канала не найдена')
		}

		if (user.id !== channelTarget.channelId) {
			throw new ForbiddenException('Удалить цель может только её создатель')
		}

		await this.prismaService.channelTarget.delete({
			where: {
				id: channelTarget.id,
			},
		})

		return true
	}
}
