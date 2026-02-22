import type { FactoryProvider, ModuleMetadata } from '@nestjs/common'

export const LiveKitOptionsSymbol = Symbol('LiveKitOptionsSymbol')

export type TLiveKitOptions = {
	apiUrl: string
	apiKey: string
	apiSecret: string
}

export type TLiveKitAsyncOptions = Pick<ModuleMetadata, 'imports'> &
	Pick<FactoryProvider<TLiveKitOptions>, 'useFactory' | 'inject'>
