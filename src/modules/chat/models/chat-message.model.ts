import { Field, ID, ObjectType } from '@nestjs/graphql'

import type { ChatMessage } from '@/prisma/generated/client'

import { UserModel } from '../../auth/account/models/user.model'
import { StreamModel } from '../../stream/models/stream.model'

@ObjectType()
export class ChatMessageModel implements ChatMessage {
	@Field(() => ID)
	public id: string

	@Field(() => String)
	public text: string

	@Field(() => UserModel)
	public user: UserModel

	@Field(() => String, { nullable: true })
	public userId: string | null

	@Field(() => StreamModel)
	public stream: StreamModel

	@Field(() => String, { nullable: true })
	public streamId: string | null

	@Field(() => ChatMessageModel, { nullable: true })
	public replyTo?: ChatMessageModel

	@Field(() => String, { nullable: true })
	public replyToId: string | null

	@Field(() => Date)
	public createdAt: Date

	@Field(() => Date)
	public updatedAt: Date
}
