import { BadRequestException, Logger } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { hash } from 'argon2'

import { Prisma, PrismaClient } from '../../../prisma/generated/client'

const adapter = new PrismaPg({
	connectionString: process.env.POSTGRES_URI,
})

const prisma = new PrismaClient({
	adapter,
	transactionOptions: {
		maxWait: 5000,
		timeout: 10000,
		isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
	},
})

async function main() {
	try {
		Logger.log('Начало заполнения базы данных')

		await prisma.$transaction([
			prisma.user.deleteMany(),
			prisma.socialLink.deleteMany(),
			prisma.stream.deleteMany(),
			prisma.category.deleteMany(),
		])

		const categoriesData = [
			{
				title: 'Just Chatting',
				slug: 'just-chatting',
				description:
					'Общение со зрителями, разговоры на любые темы и просто приятное времяпрепровождение',
				thumbnailUrl: '/categories/just-chatting.webp',
			},
			{
				title: 'Grand Theft Auto V',
				slug: 'gta-5',
				description:
					'Криминальные приключения, гонки и хаос в открытом мире Лос-Сантоса',
				thumbnailUrl: '/categories/gta-5.webp',
			},
			{
				title: 'Minecraft',
				slug: 'minecraft',
				description:
					'Кубический мир без границ: выживание, строительство и приключения',
				thumbnailUrl: '/categories/minecraft.webp',
			},
			{
				title: 'Dota 2',
				slug: 'dota-2',
				description:
					'Легендарная MOBA сражения, турниры и профессиональные матчи',
				thumbnailUrl: '/categories/dota-2.webp',
			},
			{
				title: 'Counter-Strike 2',
				slug: 'cs2',
				description:
					'Тактические шутеры, киберспортивные баталии и командная игра',
				thumbnailUrl: '/categories/cs2.webp',
			},
			{
				title: 'VALORANT',
				slug: 'valorant',
				description:
					'Тактический шутер от Riot Games с уникальными агентами и способностями',
				thumbnailUrl: '/categories/valorant.webp',
			},
			{
				title: 'League of Legends',
				slug: 'lol',
				description:
					'Главная MOBA планеты с миллионами фанатов и зрелищными турнирами',
				thumbnailUrl: '/categories/lol.webp',
			},
			{
				title: 'World of Warcraft',
				slug: 'wow',
				description:
					'Легендарная MMORPG с огромным миром, рейдами и подземельями',
				thumbnailUrl: '/categories/wow.webp',
			},
			{
				title: 'Fortnite',
				slug: 'fortnite',
				description:
					'Королевская битва со строительством, танцами и постоянными обновлениями',
				thumbnailUrl: '/categories/fortnite.webp',
			},
			{
				title: 'Apex Legends',
				slug: 'apex',
				description:
					'Динамичный королевский бой с уникальными легендами и командной игрой',
				thumbnailUrl: '/categories/apex.webp',
			},
			{
				title: 'Cyberpunk 2077',
				slug: 'cyberpunk-2077',
				description:
					'Футуристический мир Найт-Сити, киберимпланты и приключения',
				thumbnailUrl: '/categories/cyberpunk.webp',
			},
			{
				title: 'Хорроры',
				slug: 'horror',
				description: 'Страшные игры, крики и незабываемые эмоции',
				thumbnailUrl: '/categories/horror.webp',
			},
			{
				title: 'ASMR',
				slug: 'asmr',
				description: 'Приятные звуки, шепот и расслабляющий контент',
				thumbnailUrl: '/categories/asmr.webp',
			},
			{
				title: 'IRL',
				slug: 'irl',
				description:
					'Реальная жизнь: прогулки, готовка, путешествия и ежедневные будни',
				thumbnailUrl: '/categories/irl.webp',
			},
			{
				title: 'Музыка',
				slug: 'music',
				description:
					'Живые выступления, игра на инструментах и музыкальное творчество',
				thumbnailUrl: '/categories/music.webp',
			},
			{
				title: 'Фитнес и спорт',
				slug: 'fitness',
				description:
					'Тренировки, йога, здоровый образ жизни и спортивные достижения',
				thumbnailUrl: '/categories/fitness.webp',
			},
			{
				title: 'Retro игры',
				slug: 'retro',
				description:
					'Ностальгия по классике: старые консоли и легендарные игры',
				thumbnailUrl: '/categories/retro.webp',
			},
			{
				title: 'Mobile игры',
				slug: 'mobile',
				description:
					'Игры на телефонах и планшетах: от казуалок до серьезных проектов',
				thumbnailUrl: '/categories/mobile.webp',
			},
			{
				title: 'Кулинария',
				slug: 'cooking',
				description:
					'Приготовление вкусной еды, рецепты и кулинарные эксперименты',
				thumbnailUrl: '/categories/cooking.webp',
			},
			{
				title: 'Технологии и наука',
				slug: 'tech',
				description: 'Обзоры гаджетов, программирование и научные эксперименты',
				thumbnailUrl: '/categories/tech.webp',
			},
		]

		await prisma.category.createMany({
			data: categoriesData,
		})

		Logger.log('Категории успешно созданы')

		const categories = await prisma.category.findMany()

		const categoriesBySlug = Object.fromEntries(
			categories.map(category => [category.slug, category]),
		)

		const streamTitles = {
			'just-chatting': [
				'Уютный вечер с чаем и разговорами',
				'Отвечаю на все вопросы подписчиков',
				'Смотрим смешные видео вместе',
				'Разговор с психологом о жизни',
				'Читаю донаты и общаюсь',
				'Утреннее кофе и планы на день',
				'Реакция на мемы с чатом',
				'Сплетничаем и обсуждаем новости',
			],
			'gta-5': [
				'Захват казино с подписчиками',
				'Гонки по Лос-Сантосу на деньги',
				'Полицейский режим: ловим нарушителей',
				'Ролевые игры: жизнь мафиози',
				'Фарм донатных машин',
				'Управляем городом с мэром',
				'Трюки и паркур на мотоциклах',
				'Стрим по прокачке бизнеса',
			],
			minecraft: [
				'Строим город будущего',
				'Хардкорное выживание день 100',
				'Охота на дракона с подписчиками',
				'Скайблок: выживание на острове',
				'Ищем алмазы весь стрим',
				'Модный обзор: магия и технологии',
				'Постройка гигантской базы',
				'PvP турнир на сервере',
			],
			'dota-2': [
				'Ранкед с подписчиками',
				'Имба билд на нового героя',
				'Разбор пабов с профессионалом',
				'Катка за 10к MMR',
				'Турнир среди зрителей',
				'Учимся играть на миде',
				'Варварские сборки и эксперименты',
				'Обзор патча и меты',
			],
			cs2: [
				'Ранкед матчмейкинг',
				'Тренировка эймов и стрельбы',
				'Открытие кейсов в перерывах',
				'Играем фейсит с подписчиками',
				'Тактические тренировки',
				'Вингмен с чатом',
				'Разбираем про игроков',
				'Стрим по фарм статистики',
			],
			valorant: [
				'Ранкед до бесконечности',
				'Учим агентов с нуля',
				'Турнир среди зрителей',
				'Имба стратегии для победы',
				'Тренировка аим и механик',
				'Открытие рандомных агентов',
				'Смотрим про сцены',
				'Играем с подписчиками',
			],
			lol: [
				'Соло ранк до алмаза',
				'Нерф или бафф: тестим патч',
				'Турнир ARAM с чатом',
				'Учим новых чемпионов',
				'Тим мид с подписчиками',
				'Обзор про сцены',
				'Эксперименты с билдами',
				'Катка до первого поражения',
			],
			wow: [
				'Рейд с гильдией',
				'Фарм легендарных предметов',
				'Продажа ключей и подземелий',
				'Пвп арена 2х2',
				'Левелинг нового чара',
				'Охота за маунтами',
				'Эпохальный ключ +20',
				'Обзор нового патча',
			],
			fortnite: [
				'Королевская битва со зрителями',
				'Учимся строить как профи',
				'Турнир на деньги',
				'Новый сезон: первые впечатления',
				'Креативные карты с чатом',
				'Фарм побед весь стрим',
				'Танцы и эмоции в лобби',
				'Имба стратегии для топ-1',
			],
			apex: [
				'Ранкед до мастера',
				'Играем за нового легенда',
				'Турнир 3х3 с подписчиками',
				'Тренировка стрельбы на полигоне',
				'Фарм 4к дамага',
				'Разбираем мету оружия',
				'Катки с рандомами',
				'Охота за хищником',
			],
			'cyberpunk-2077': [
				'Прохождение с нуля: киберпанк',
				'Исследуем Найт-Сити',
				'Секреты и пасхалки',
				'Сбор лучшего билда',
				'Моды и графика',
				'Фоторежим и красоты города',
				'Все концовки за стрим',
				'DLC прохождение',
			],
			horror: [
				'Прохождение хоррора ночью',
				'Реакция на скримеры',
				'Самые страшные инди игры',
				'Играем в компании с чатом',
				'Ночной стрим с ужасами',
				'Детективные хорроры',
				'Психологические триллеры',
				'Кричим и боимся вместе',
			],
			asmr: [
				'Шепот и микрофон',
				'Звуки дождя для сна',
				'АСМР с расческами и кисточками',
				'Расслабление перед сном',
				'Еда: звуки перекуса',
				'Массаж микрофона',
				'Шуршание упаковок',
				'Триггеры для мурашек',
			],
			irl: [
				'Прогулка по городу',
				'Готовка на стриме',
				'Уборка и мотивация',
				'Покупки с чатом',
				'Путешествие в реальном времени',
				'Завтрак со зрителями',
				'Распаковка посылок',
				'День из жизни стримера',
			],
			music: [
				'Игра на гитаре под заказ',
				'Создание бита с нуля',
				'Караоке с подписчиками',
				'Пишем песню вместе',
				'Сведение и мастеринг',
				'Джем с музыкантами',
				'Обзор музыкального оборудования',
				'Учимся играть на пианино',
			],
			fitness: [
				'Утренняя зарядка',
				'Тренировка с подписчиками',
				'Йога для начинающих',
				'Правильное питание и рецепты',
				'Растяжка на стриме',
				'Спортзал онлайн',
				'Челлендж: 100 отжиманий',
				'Похудение с чатом',
			],
			retro: [
				'Прохождение классики',
				'Игры из детства',
				'Старые консоли: сега и денди',
				'Ностальгия с чатом',
				'Ретро хорроры',
				'Легендарные RPG прошлого',
				'Аркады и автоматы',
				'Обзор старых игр',
			],
			mobile: [
				'Играем в бравл старс',
				'Стрим с телефона',
				'Мобильные королевские битвы',
				'Топ мобильных игр',
				'Гайды по мобилкам',
				'Залив на телефоне',
				'Прохождение на андроид',
				'Обзор новых мобильных игр',
			],
			cooking: [
				'Готовим ужин вместе',
				'Рецепты для стримеров',
				'Выпечка и десерты',
				'Готовка по заявкам чата',
				'Кулинарный челлендж',
				'Пробуем странные блюда',
				'Завтрак за 15 минут',
				'Кухня народов мира',
			],
			tech: [
				'Сборка компьютера',
				'Обзор нового железа',
				'Программирование на стриме',
				'Настройка софта',
				'Ремонт техники',
				'Создание приложений',
				'Обзор гаджетов',
				'Линукс и сервера',
			],
		}

		const usernames = [
			'shadowhunter',
			'nightwolf',
			'phoenixfire',
			'darkknight',
			'silentassassin',
			'cyberghost',
			'thunderbolt',
			'frostmaster',
			'blazestorm',
			'neondemon',
			'viperstrike',
			'crimsonking',
			'ironfist',
			'stormrider',
			'midnightfury',
			'dragonslayer',
			'phantomreaper',
			'quantumrift',
			'ragingstorm',
			'silentecho',
			'toxicavenger',
			'venomstrike',
			'wildtiger',
			'xenomorph',
			'zerocool',
			'alphawolf',
			'betatester',
			'chaostheory',
			'darkmatter',
			'electricshock',
			'flamethrower',
			'ghostrider',
			'hellfire',
			'icebreaker',
			'jokerface',
			'killerbee',
			'lightningrod',
			'madhatter',
			'nightmare',
			'omegared',
			'psychopath',
			'quicksilver',
			'razoredge',
			'shadowfury',
			'toxicwaste',
			'ultraviolet',
			'viciouscircle',
			'warmachine',
			'xrayspecs',
			'yellowjacket',
			'zenmaster',
			'abyssalone',
			'bladerunner',
			'cosmicdust',
			'darkoracle',
			'eternalnight',
			'fallenangel',
			'grimreaper',
			'hellraiser',
			'infernoking',
			'junglebeast',
			'karmapolice',
			'lasthope',
			'moonwalker',
			'nemesisx',
			'outlawstar',
			'punisherx',
			'quantumleap',
			'rogueagent',
			'savagebeast',
			'terminator',
			'undertaker',
			'vampirelord',
			'warlockx',
			'xenongas',
			'yetihunter',
			'zeusthunder',
			'arcticfox',
			'blackwidow',
			'cryptoking',
			'digitalghost',
			'electricwizard',
			'frostbite',
			'goldeneagle',
			'highvoltage',
			'icephoenix',
			'jungleking',
			'kryptonite',
			'lonesurvivor',
			'metalgear',
			'neurallink',
			'omegapoint',
			'pixelpusher',
			'quantumbot',
			'reddragon',
			'siliconvalley',
			'techsavvy',
			'urbanlegend',
			'virtualhero',
			'webspinner',
			'xeroxcopy',
			'yellowsub',
			'zebracross',
		]

		await prisma.$transaction(async tx => {
			for (const username of usernames) {
				const randomCategory =
					categoriesBySlug[
						Object.keys(categoriesBySlug)[
							Math.floor(Math.random() * Object.keys(categoriesBySlug).length)
						]
					]

				const userExist = await tx.user.findUnique({
					where: { username },
				})

				if (!userExist) {
					const createdUser = await tx.user.create({
						data: {
							email: `${username}@mail.ru`,
							password: await hash('12345678'),
							username,
							displayName: username,
							avatar: `/channels/${username}.webp`,
							isEmailVerified: true,
							socialLinks: {
								createMany: {
									data: [
										{
											title: 'Telegram',
											url: `https://t.me/${username}`,
											position: 1,
										},
										{
											title: 'YouTube',
											url: `https://youtube.com/@${username}`,
											position: 2,
										},
									],
								},
							},
						},
					})

					const randomTitles = streamTitles[randomCategory.slug]
					const randomTitle =
						randomTitles[Math.floor(Math.random() * randomTitles.length)]

					await tx.stream.create({
						data: {
							title: randomTitle,
							thumbnailUrl: `/streams/${createdUser.username}.webp`,
							user: {
								connect: {
									id: createdUser.id,
								},
							},
							category: {
								connect: {
									id: randomCategory.id,
								},
							},
						},
					})

					Logger.log(
						`Пользователь ${createdUser.username} и его стрим успешно созданы`,
					)
				}
			}
		})

		Logger.log(`Заполнение базы данных завершено успешно`)
	} catch (error) {
		Logger.error(error)
		throw new BadRequestException('Ошибка заполнения базы данных')
	} finally {
		await prisma.$disconnect()
		Logger.log('Соединение с базой данных успешно закрыто')
	}
}

main()
