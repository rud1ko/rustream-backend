import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber } from 'class-validator'

import { ChannelTargetType } from '@/prisma/generated/enums'

@InputType()
export class CreateChannelTargetInput {
	@Field(() => ChannelTargetType)
	@IsNotEmpty()
	public type: ChannelTargetType

	@Field(() => Number)
	@IsNumber()
	@IsNotEmpty()
	public value: number
}
