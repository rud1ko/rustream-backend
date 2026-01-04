import { ConflictException, Injectable } from '@nestjs/common'
import * as Upload from 'graphql-upload/Upload.js'
import * as sharp from 'sharp'

import type { User } from '@/prisma/generated/client'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { S3Service } from '../../libs/s3/s3.service'

import { ChangeProfileInfoInput } from './inputs/change-profile-info.input'

@Injectable()
export class ProfileService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly s3Service: S3Service,
	) {}

	public async changeAvatar(user: User, file: Upload) {
		if (user.avatar) {
			await this.s3Service.remove(user.avatar)
		}

		const chunks: Buffer[] = []

		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk)
		}

		const buffer = Buffer.concat(chunks)

		const fileName = `/channels/${user.username}.webp`

		if (file.filename && file.filename.endWith('.gif')) {
			const processedBuffer = await sharp(buffer, { animated: true })
				.resize(512, 512)
				.webp()
				.toBuffer()

			await this.s3Service.upload(processedBuffer, fileName, 'image/webp')
		} else {
			const processedBuffer = await sharp(buffer)
				.resize(512, 512)
				.webp()
				.toBuffer()

			await this.s3Service.upload(processedBuffer, fileName, 'image/webp')
		}

		await this.prismaService.user.update({
			where: {
				id: user.id,
			},
			data: {
				avatar: fileName,
			},
		})

		return true
	}

	public async removeAvatar(user: User) {
		if (!user.avatar) {
			return
		}

		await this.s3Service.remove(user.avatar)

		await this.prismaService.user.update({
			where: {
				id: user.id,
			},
			data: {
				avatar: null,
			},
		})

		return true
	}

	public async changeInfo(user: User, input: ChangeProfileInfoInput) {
		const { username, displayName, bio } = input

		const usernameExist = await this.prismaService.user.findUnique({
			where: { username },
		})

		if (usernameExist && username !== user.username) {
			throw new ConflictException("Имя пользователя уже занято")
		}

		await this.prismaService.user.update({
			where: {
				id: user.id,
			},
			data: {
				username,
				displayName,
				bio
			},
		})

		return true
	}
}
