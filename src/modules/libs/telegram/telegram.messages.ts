import type { SponsorshipPlan, User } from '@/prisma/generated/client'
import { SessionMetadata } from '@/src/shared/types/session-metadata.types'

export const MESSAGES = {
	welcome: `
		Добро пожаловать в RuStream! 🎉\n\n
		Чтобы получать уведомления и улучшить ваш опыт использования платформы, давайте свяжем ваш Telegram аккаунт с RuStream.\n\n
		Нажмите на кнопку ниже и перейдите в раздел <b>Уведомления</b>, чтобы завершить настройку.
	`,

	authSuccess: `
		✅ Авторизация успешна!\n
		Вы успешно вошли в аккаунт RuStream.
	`,

	invalidToken: `
		⚠️ Недействительный или просроченный токен.
	`,
	profile: (user: User, followersCount: number) =>
		`<b>👤 Профиль пользователя:</b>\n\n` +
		`😀 Имя пользователя: <b>${user.username}</b>\n` +
		`📁 Email: <b>${user.email}</b>\n` +
		`👥 Количество подписчиков: <b>${followersCount}</b>\n` +
		`📄 О себе: <b>${user.bio}</b>\n\n` +
		`⚙️ Нажмите на кнопку ниже, чтобы перейти к настройкам профиля.`,
	follows: (user: User) =>
		`📺 <a href="https://rustream.ru/${user.username}">${user.username}</a>`,
	resetPassword: (token: string, metadata: SessionMetadata) =>
		`<b>Сброс пароля</b> \n\n` +
		`Вы запросили сброс пароля для вашей учетной записи на платформе <b>RuStream</b>.\n\n` +
		`чтобы создать новый пароль, пожалуйста, перейдите по следующей ссылке: \n\n` +
		`<b><a href="https://rustream.ru/account/recovery/${token}">Сбросить пароль</a></b>\n\n` +
		`<b>Дата запроса:</b> ${new Date().toLocaleDateString()}в ${new Date().toLocaleTimeString()}\n\n` +
		`<b>Информация о запросе:</b>\n\n` +
		`<b>Расположение:</b> ${metadata.location.country}, ${
			metadata.location.city
		}\n` +
		`<b>Операционная система:</b> ${metadata.device.os}\n` +
		`<b>Браузер:</b> ${metadata.device.browser}\n` +
		`<b>IP-адрес:</b> ${metadata.ip}\n\n` +
		`Если вы не делали этот запрос, просто проигнорируйте это сообщение.\n\n` +
		`Спасибо за использование <b>RuStream</b>!`,
	deactivate: (token: string, metadata: SessionMetadata) =>
		`<b>Запрос на деактивация аккаунта</b>\n\n` +
		`Вы инициализировали процесс деактивации вашего аккаунта на платформе <b>RuStream</b>.\n\n` +
		`Для завершения операции, пожалуйста, подтвердите свой запрос, введя следующий код подтверждения:\n\n` +
		`<b>Код подтверждения: ${token}</b>\n\n` +
		`<b>Дата запроса:</b> ${new Date().toLocaleDateString()} в ${new Date().toLocaleTimeString()}\n\n` +
		`<b>Информация о запросе:</b>\n\n` +
		`- <b>Расположение:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`- <b>Операционная система:</b> ${metadata.device.os}\n` +
		`- <b>Браузер:</b> ${metadata.device.browser}\n` +
		`- <b>IP-адрес:</b> ${metadata.ip}`,
	accountDeleted:
		`<b>Ваш аккаунт был полностью удалён.</b>\n\n` +
		`Ваш аккаунт был полностью стёрт из базы данных RuStream. Все ваши данные и информация были удалены безвозвратно.\n\n` +
		`Вы больше не будете получать уведомления в TG и на почту.\n\n` +
		`Если вы захотите вернуться на платформу, вы можете зарегистрироваться по следующей ссылке:\n` +
		`<b><a href="https://rustream.ru/account/create">Зарегистрироваться на RuStream</a></b>\n\n` +
		`Спасибо, что были с нами! Мы всегда будем рады видеть вас снова на платформе.\n\n` +
		`С увежением, команда <b>RuStream</b>`,
	streamStart: (channel: User) =>
		`<b>На канале ${channel.displayName} началась трансляция!</b>\n\n` +
		`Смотрите здесь: <a href="https://rustream.ru/${channel.username}">Перейти на трансляцию</a>`,
	newFollowing: (follower: User, followersCount: number) =>
		`<b>У вас новый подписчик!</b>\n\n` +
		`Это пользователь <a href="https://rustream.ru/${follower.username}">${follower.displayName}</a>\n\n` +
		`Итоговое количество подписчиков на вашем канале: ${followersCount}`,
	newSponsorship: (plan: SponsorshipPlan, sponsor: User) =>
		`<b>Новый спонсор!</b>\n\n` +
		`Вы получили новое спонсорство на план <b>${plan.title}</b>.\n` +
		`Сумма: <b>${plan.price}</b> рублей\n` +
		`Спонсор: <a href="https://rustream.ru/${sponsor.username}">${sponsor.displayName}</a>\n` +
		`Дата оформления: <b>${new Date().toLocaleDateString()} в ${new Date().toLocaleTimeString()}</b>\n\n` +
		`Благодарим вас за вашу работу и поддержку на платформе <b>RuStream!</b>`,
	enableTwoFactor:
		`Обеспевьте свою безопасность!\n\n` +
		`Включите двухфакторную аутентификацию в <a href="https://rustream.ru/dashboard/settings">настройках аккаунта</a>.`,
	verifyChannel:
		`<b>🎉 Поздравляем! Ваш канал верифицирован</b>\n\n` +
		`Мы рады сообщить, что ваш канал теперь верифицирован, и вы получили официальный значок.\n\n` +
		`Значок верификации подтверждает подлинность вашего канала и улучшает доверие зрителей.\n\n` +
		`Спасибо, что вы с нами и продолжаете развивать свой канал вместе с <b>RuStream</b>`,
}
