import { v4 as uuidV4 } from 'uuid'

import { TokenType, type User } from '@/prisma/generated/client'
import { PrismaService } from '@/src/core/prisma/prisma.service'

export const generateToken = async (
	prismaService: PrismaService,
	user: User,
	type: TokenType,
	isUUID: boolean = true,
) => {
	let token: string

	if (isUUID) {
		token = uuidV4()
	} else {
		token = Math.floor(
			Math.random() * (1_000_000 - 100_000) + 100_000,
		).toString()
	}

	// Время жизни токена 15 мин
	const expiresIn = new Date(new Date().getTime() + 300_000)

	const existingToken = await prismaService.token.findFirst({
		where: {
			user: {
				id: user.id,
			},
			type,
		},
	})

	if (existingToken) {
		await prismaService.token.delete({
			where: { id: existingToken.id },
		})
	}

	const newToken = await prismaService.token.create({
		data: {
			token,
			expiresIn,
			type,
			user: {
				connect: {
					id: user.id,
				},
			},
		},
		include: {
			user: true,
		},
	})

	return newToken
}
