import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { MailService } from '../libs/mail/mail.service'
import { S3Service } from '../libs/s3/s3.service'
import { TelegramService } from '../libs/telegram/telegram.service'

@Injectable()
export class CronService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly s3Service: S3Service,
		private readonly telegramService: TelegramService,
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
			include: {
				notificationSettings: true,
				stream: true,
			},
		})

		for (const user of deactivatedAccounts) {
			await this.mailService.sendAccountRemove(user.email)

			if (user.notificationSettings.telegramNotifications && user.telegramId) {
				await this.telegramService.sendAccountDeletion(user.telegramId)
			}

			if (user.avatar) {
				this.s3Service.remove(user.avatar)
			}

			if (user.stream.thumbnailUrl) {
				this.s3Service.remove(user.stream.thumbnailUrl)
			}
		}

		await this.prismaService.user.deleteMany({
			where: { isDeactivated: true, deactivatedAt: { lte: weekAgo } },
		})
	}
}
