import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { User } from '@/prisma/generated/client'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { CreateChannelTargetInput } from './inputs/create-target.input'
import { ChannelTargetModel } from './models/target.model'
import { TargetService } from './target.service'

@Resolver('Target')
export class TargetResolver {
	public constructor(private readonly targetService: TargetService) {}

	@Authorization()
	@Query(() => [ChannelTargetModel], { name: 'findAllChannelTargetsByUserId' })
	public async findAllChannelTargetsByUserId(@Authorized() user: User) {
		return this.targetService.findAllByChannelId(user)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'createChannelTarget' })
	public async createChannelTarget(
		@Authorized() user: User,
		@Args('data') input: CreateChannelTargetInput,
	) {
		return this.targetService.create(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeChannelTarget' })
	public async removeChannelTarget(
		@Authorized() user: User,
		@Args('targetId') targetId: string,
	) {
		return this.targetService.remove(user, targetId)
	}
}
