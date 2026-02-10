import { InMemoryUsersRepository } from 'src/repository/in-memory-repositorys/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { hashPassword } from 'src/auth/crypto'
import { AuthenticateUseCase } from './authenticate.use-case'
import { InvalidCredentialsError } from 'src/errors/invalid-credentials-error'

/**
 * @typedef {import('../services/authenticate.use-case.js').AuthenticateUseCase} AuthenticateUseCase
 * @typedef {import('../repository/in-memory-repositorys/in-memory-users-repository.js').InMemoryUsersRepository} InMemoryUsersRepository
 */

/**@type {InMemoryUsersRepository} */
let usersRepository
/** @type {AuthenticateUseCase} */
let sut

describe('Authenticate Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new AuthenticateUseCase(usersRepository)
	})

	it('should be able to authenticate', async () => {
		const email = 'jhonDoe@example.com'
		const password = 'password123'

		await usersRepository.create({
			id: crypto.randomUUID(),
			name: 'John Doe',
			email,
			created_at: new Date(),
			password_hash: await hashPassword(password),
			role: 'user',
		})

		const { user } = await sut.execute({ email, password })
		expect(user.id).toEqual(expect.any(String))
	})

	it('Should no be able authenticate with wrong email', async () => {
		const password = 'password123'

		await usersRepository.create({
			name: 'John Doe',
			email: 'jhonDoe@example.com',
			password_hash: await hashPassword(password),
		})

		await expect(
			sut.execute({
				email: 'wrongemail@example.com',
				password,
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})
})
it('Should no be able authenticate with wrong password', async () => {
	const email = 'jhonDoe@example.com'
	await usersRepository.create({
		name: 'John Doe',
		email,
		password_hash: await hashPassword('password123'),
	})

	await expect(sut.execute({ email, password: '123456' })).rejects.toBeInstanceOf(InvalidCredentialsError)
})
