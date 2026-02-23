import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { AccountModule } from '../modules/auth/account/account.module'
import { DeactivateModule } from '../modules/auth/deactivate/deactivate.module'
import { PasswordRecoveryModule } from '../modules/auth/password-recovery/password-recovery.module'
import { ProfileModule } from '../modules/auth/profile/profile.module'
import { SessionModule } from '../modules/auth/session/session.module'
import { SocialLinkModule } from '../modules/auth/social-link/social-link.module'
import { TotpModule } from '../modules/auth/totp/totp.module'
import { VerificationModule } from '../modules/auth/verification/verification.module'
import { CronModule } from '../modules/cron/cron.module'
import { LiveKitModule } from '../modules/libs/live-kit/live-kit.module'
import { MailModule } from '../modules/libs/mail/mail.module'
import { S3Module } from '../modules/libs/s3/s3.module'
import { IngressModule } from '../modules/stream/ingress/ingress.module'
import { StreamModule } from '../modules/stream/stream.module'
import { IS_DEV } from '../shared/utils/is-dev'

import { getGraphQLConfig } from './config/graphql.config'
import { getLiveKitConfig } from './config/live-kit.config'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'
import { WebhookModule } from '../modules/webhook/webhook.module'
import { CategoryModule } from '../modules/category/category.module'
import { ChatModule } from '../modules/chat/chat.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV,
			isGlobal: true,
		}),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			imports: [ConfigModule],
			useFactory: getGraphQLConfig,
			inject: [ConfigService],
		}),
		LiveKitModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getLiveKitConfig,
			inject: [ConfigService],
		}),
		PrismaModule,
		RedisModule,
		MailModule,
		AccountModule,
		SessionModule,
		VerificationModule,
		PasswordRecoveryModule,
		TotpModule,
		DeactivateModule,
		CronModule,
		S3Module,
		ProfileModule,
		SocialLinkModule,
		StreamModule,
		IngressModule,
		WebhookModule,
		CategoryModule,
		ChatModule,
	],
})
export class CoreModule {}
