import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { ChannelTarget, ChannelTargetType } from '@/prisma/generated/client'
import { UserModel } from '@/src/modules/auth/account/models/user.model'

registerEnumType(ChannelTargetType, { name: 'ChannelTargetType' })

@ObjectType()
export class ChannelTargetModel implements ChannelTarget {
	@Field(() => ID)
	public id: string

	@Field(() => ChannelTargetType)
	public type: ChannelTargetType

	@Field(() => Number)
	public value: number

	@Field(() => String)
	public channelId: string

	@Field(() => UserModel)
	public channel: UserModel

	@Field(() => Date)
	public createdAt: Date

	@Field(() => Date)
	public updatedAt: Date
}
