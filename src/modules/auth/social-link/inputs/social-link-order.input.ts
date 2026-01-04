import { Field, ID, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

@InputType()
export class SocialLinkOrderInput {
	@Field(() => ID)
	@IsString()
	@IsNotEmpty()
	public id: string

	@Field(() => String)
	@IsNumber()
	@IsNotEmpty()
	public position: number
}
