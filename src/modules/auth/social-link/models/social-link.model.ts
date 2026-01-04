import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

import type { SocialLink } from '@/prisma/generated/client'

@ObjectType()
export class SocialLinkModel implements SocialLink {
	@Field(() => ID)
	public id: string

	@Field(() => String)
	public title: string

	@Field(() => String)
	public url: string

	@Field(() => String)
	public position: number

	@Field(() => String)
	@IsOptional()
	public userId: string

	@Field(() => Date)
	public createdAt: Date

	@Field(() => Date)
	public updatedAt: Date
}
