import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

export const VerifyChannelTemplate = () => {
	return (
		<Html>
			<Head />
			<Preview>Ваш канал верифицирован! 🎉</Preview>
			<Tailwind>
				<Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
					<Section className='text-center mb-8'>
						<Heading className='text-3xl text-black font-bold'>
							Поздравляем! Ваш канал верифицирован
						</Heading>
						<Text className='text-base text-black mt-2'>
							Рады вам сообщить, что теперь ваш аккаунт RuStream верифицирован, и вы получаете официальный значок.
						</Text>
					</Section>

					<Section className='bg-green-50 rounded-lg p-6 text-center mb-6'>
						<Heading className='text-2xl text-green-700 font-semibold'>
							✅ Аккаунт верифицирован
						</Heading>
						<Text className='text-black mt-2'>
							Отныне ваш профиль отмечен официальным знаком верификации
						</Text>
					</Section>

					<Section className='bg-gray-100 rounded-lg p-6 mb-6'>
						<Heading className='text-xl font-semibold text-[#18b9ae]'>
							🎯 Преимущества верификации:
						</Heading>
						<ul className='list-disc list-inside mt-2'>
							<li>Официальный статус подтвержденного канала</li>
							<li>Повышенное доверие зрителей</li>
							<li>Приоритетное отображение в поиске</li>
							<li>Доступ к эксклюзивным функциям</li>
						</ul>
					</Section>

					<Section className='text-center mt-8'>
						<Text className='text-gray-600'>
							Вопросы? Пишите:{' '}
							<Link 
								href='mailto:chakryan_rudik@mail.ru'
								className='text-[#18b9ae] underline'
							>
								chakryan_rudik@mail.ru
							</Link>
						</Text>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	)
}