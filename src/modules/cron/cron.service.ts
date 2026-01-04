import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { MailService } from '../libs/mail/mail.service'

@Injectable()
export class CronService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
	) {}

	// Вызов деактивации аккаунтов каждую полночь
	@Cron('0 0 * * *')
	public async deleteDeactivatedAccounts() {
		const weekAgo = new Date()
		weekAgo.setDate(weekAgo.getDay() - 7)
		// Для деактивации аккаунтов должна пройти неделя

		const deactivatedAccounts = await this.prismaService.user.findMany({
			where: {
				isDeactivated: true,
				deactivatedAt: {
					lte: weekAgo,
				},
			},
		})

		for (const user of deactivatedAccounts) {
			await this.mailService.sendAccountRemove(user.email)
		}

		await this.prismaService.user.deleteMany({
			where: { isDeactivated: true, deactivatedAt: { lte: weekAgo } },
		})
	}
}
