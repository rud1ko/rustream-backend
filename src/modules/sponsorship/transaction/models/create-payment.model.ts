import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

import { TransactionStatus } from '@/prisma/generated/client'

registerEnumType(TransactionStatus, { name: 'TransactionStatus' })

@ObjectType()
export class CreatePaymentModel {
	@Field(() => String)
	public url: string
}
