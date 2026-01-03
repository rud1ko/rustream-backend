import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { AccountModule } from '../module/auth/account/account.module'
import { SessionModule } from '../module/auth/session/session.module'
import { IS_DEV } from '../shared/utils/is-dev'

import { getGraphQLConfig } from './config/graphql.config'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'

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
		PrismaModule,
		RedisModule,
		AccountModule,
		SessionModule,
	],
})
export class CoreModule {}
