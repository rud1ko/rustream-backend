import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { LiveKitService } from '../libs/live-kit/live-kit.service'

@Injectable()
export class WebhookService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly liveKitService: LiveKitService,
	) {}

	public async receiveWebhookLiveKit(body: string, authorization: string) {
		const eventOptions = await this.liveKitService.webhookReceiver.receive(
			body,
			authorization,
			true,
		)

		if (eventOptions.event === 'ingress_started') {
			await this.prismaService.stream.update({
				where: {
					ingressId: eventOptions.ingressInfo.ingressId,
				},
				data: {
					isLive: true,
				},
			})
		}

		if (eventOptions.event === "ingress_ended") {
			await this.prismaService.stream.update({
				where: {
					ingressId: eventOptions.ingressInfo.ingressId,
				},
				data: {
					isLive: false,
				},
			})
		}
	}
}
