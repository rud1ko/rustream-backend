import { TLiveKitOptions } from '@/src/modules/libs/live-kit/types/live-kit.types'
import { ConfigService } from '@nestjs/config'

export const getLiveKitConfig = (configService: ConfigService): TLiveKitOptions => {
	return {
		apiUrl: configService.get<string>('LIVEKIT_API_URL'),
		apiKey: configService.get<string>('LIVEKIT_API_KEY'),
		apiSecret: configService.get<string>('LIVEKIT_API_SECRET'),
	}
}