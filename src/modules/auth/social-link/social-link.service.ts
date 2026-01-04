import { Injectable } from '@nestjs/common'

import type { User } from '@/prisma/generated/client'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { SocialLinkOrderInput } from './inputs/social-link-order.input'
import { SocialLinkInput } from './inputs/social-link.input'

@Injectable()
export class SocialLinkService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findSocialLinks(userId: string) {
		const socialLinks = await this.prismaService.socialLink.findMany({
			where: { userId },
			orderBy: { position: 'desc' },
		})

		return socialLinks
	}

	public async createSocialLink(user: User, input: SocialLinkInput) {
		const { title, url } = input

		const lastSocialLink = await this.prismaService.socialLink.findFirst({
			where: {
				userId: user.id,
			},
			orderBy: {
				position: 'desc',
			},
		})

		const newPosition = lastSocialLink ? lastSocialLink.position + 1 : 1

		await this.prismaService.socialLink.create({
			data: {
				title,
				url,
				position: newPosition,
				user: {
					connect: {
						id: user.id,
					},
				},
			},
		})

		return true
	}

	public async reorderSocialLinks(list: SocialLinkOrderInput[]) {
		if (!list.length) {
			return
		}

		const updatePromises = list.map(socialLink => {
			return this.prismaService.socialLink.update({
				where: {
					id: socialLink.id,
				},
				data: {
					position: socialLink.position,
				},
			})
		})

		await Promise.all(updatePromises)

		return true
	}

	public async updateSocialLink(id: string, input: SocialLinkInput) {
		const { title, url } = input

		await this.prismaService.socialLink.update({
			where: {
				id,
			},
			data: {
				title,
				url,
			},
		})

		return true
	}

	public async removeSocialLink(id: string) {
		await this.prismaService.socialLink.delete({
			where: {
				id,
			},
		})

		return true
	}
}
