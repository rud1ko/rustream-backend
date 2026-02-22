import { Inject, Injectable } from '@nestjs/common'
import {
	IngressClient,
	RoomServiceClient,
	WebhookReceiver,
} from 'livekit-server-sdk'

import { LiveKitOptionsSymbol, TLiveKitOptions } from './types/live-kit.types'

@Injectable()
export class LiveKitService {
	private roomServiceField: RoomServiceClient
	private ingressClientField: IngressClient
	private webhookReceiverField: WebhookReceiver

	public constructor(
		@Inject(LiveKitOptionsSymbol) private readonly options: TLiveKitOptions,
	) {
		this.roomServiceField = new RoomServiceClient(
			this.options.apiUrl,
			this.options.apiKey,
			this.options.apiSecret,
		)

		this.ingressClientField = new IngressClient(this.options.apiUrl)

		this.webhookReceiverField = new WebhookReceiver(
			this.options.apiKey,
			this.options.apiSecret,
		)
	}

	public get roomService(): RoomServiceClient {
		return this.createProxy(this.roomServiceField)
	}

	public get ingressClient(): IngressClient {
		return this.createProxy(this.ingressClientField)
	}

	public get webhookReceiver(): WebhookReceiver {
		return this.createProxy(this.webhookReceiverField)
	}

	private createProxy<T extends object>(target: T) {
		return new Proxy(target, {
			get: (obj, prop) => {
				const value = obj[prop as keyof T]

				if (typeof value === 'function') {
					return value.bind(obj)
				}

				return value
			},
		})
	}
}
