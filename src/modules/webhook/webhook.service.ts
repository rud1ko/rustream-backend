import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { LiveKitService } from '../libs/live-kit/live-kit.service'
import { NotificationService } from '../notification/notification.service'

@Injectable()
export class WebhookService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly liveKitService: LiveKitService,
		private readonly notificationService: NotificationService,
	) {}

	public async receiveWebhookLiveKit(body: string, authorization: string) {
		const eventOptions = await this.liveKitService.webhookReceiver.receive(
			body,
			authorization,
			true,
		)

		if (eventOptions.event === 'ingress_started') {
			const stream = await this.prismaService.stream.update({
				where: {
					ingressId: eventOptions.ingressInfo.ingressId,
				},
				data: {
					isLive: true,
				},
				include: {
					user: true,
				},
			})

			const followers = await this.prismaService.follow.findMany({
				where: {
					followingId: stream.userId,
					follower: {
						isDeactivated: false,
					},
				},
				include: {
					follower: {
						include: {
							notificationSettings: true,
						},
					},
				},
			})

			for (const follow of followers) {
				const follower = follow.follower

				if (follower.notificationSettings.siteNotifications) {
					await this.notificationService.createStreamStart(
						follower.id,
						stream.user,
					)
				}
			}
		}

		if (eventOptions.event === 'ingress_ended') {
			const stream = await this.prismaService.stream.update({
				where: {
					ingressId: eventOptions.ingressInfo.ingressId,
				},
				data: {
					isLive: false,
				},
			})

			await this.prismaService.chatMessage.deleteMany({
				where: {
					streamId: stream.id,
				},
			})
		}
	}
}
