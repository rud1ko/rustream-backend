import { ConfigService } from '@nestjs/config'

import { TStripeOptions } from '@/src/modules/libs/stripe/types/stripe.types'

export const getStripeConfig = (
	configService: ConfigService,
): TStripeOptions => {
	return {
		apiKey: configService.get<string>('STRIPE_SECRET_KEY'),
		config: {
			apiVersion: '2026-03-25.dahlia',
		},
	}
}
