import { type DynamicModule, Module } from '@nestjs/common'

import { LiveKitService } from './live-kit.service'
import {
	LiveKitOptionsSymbol,
	type TLiveKitAsyncOptions,
	type TLiveKitOptions,
} from './types/live-kit.types'

@Module({})
export class LiveKitModule {
	public static forRoot(options: TLiveKitOptions): DynamicModule {
		return {
			module: LiveKitModule,
			providers: [
				{
					provide: LiveKitOptionsSymbol,
					useValue: options,
				},
				LiveKitService,
			],
			exports: [LiveKitService],
			global: true,
		}
	}

	public static forRootAsync(options: TLiveKitAsyncOptions): DynamicModule {
		return {
			module: LiveKitModule,
			imports: options.imports || [],
			providers: [
				{
					provide: LiveKitOptionsSymbol,
					useFactory: options.useFactory,
					inject: options.inject || [],
				},
				LiveKitService,
			],
			exports: [LiveKitService],
			global: true,
		}
	}
}
