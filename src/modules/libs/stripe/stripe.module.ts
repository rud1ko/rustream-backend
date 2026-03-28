import { type DynamicModule, Module } from '@nestjs/common'

import { StripeService } from './stripe.service'
import {
	StripeOptionsSymbol,
	TStripeAsyncOptions,
	TStripeOptions,
} from './types/stripe.types'

@Module({
	providers: [StripeService],
})
export class StripeModule {
	public static forRoot(options: TStripeOptions): DynamicModule {
		return {
			module: StripeModule,
			providers: [
				{
					provide: StripeOptionsSymbol,
					useValue: options,
				},
				StripeService,
			],
			exports: [StripeService],
			global: true,
		}
	}

	public static forRootAsync(options: TStripeAsyncOptions): DynamicModule {
		return {
			module: StripeModule,
			imports: options.imports || [],
			providers: [
				{
					provide: StripeOptionsSymbol,
					useFactory: options.useFactory,
					inject: options.inject || [],
				},
				StripeService,
			],
			exports: [StripeService],
			global: true,
		}
	}
}
