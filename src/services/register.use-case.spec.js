import { InMemoryUsersRepository } from 'src/repository/in-memory-repositorys/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register.use-case'
import { verifyPassword } from 'src/auth/crypto'
import { UserAlreadyExistsError } from 'src/errors/user-already-exists-error'

/**
 * @typedef {import('../services/register.use-case.js').RegisterUseCase} RegisterUseCase
 * @typedef {import('../repository/in-memory-repositorys/in-memory-users-repository.js').InMemoryUsersRepository} InMemoryUsersRepository
 */

/**@type {InMemoryUsersRepository} */
let inMemoryUsersRepository
/** @type {RegisterUseCase} */
let sut

describe('Register Use Case', () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository()
		sut = new RegisterUseCase(inMemoryUsersRepository)
	})

	it('should be able to register a new user', async () => {
		const { user } = await sut.execute('John Doe', 'jhonDoe@example.com', 'password123')
		expect(user.id).toEqual(expect.any(String))
	})

	it('Should hash user password upon registration', async () => {
		const { user } = await sut.execute('John Doe', 'jhonDoe@example.com', '123456')

		console.log(await verifyPassword('123456', user.password_hash))

		const isPasswordCorrectlyHashed = await verifyPassword('123456', user.password_hash)
		expect(isPasswordCorrectlyHashed).toBe(true)
	})
	it('Should not be able to registration with same email twice', async () => {
		const email = 'jhonDoe@example.com'
		await sut.execute('John Doe', email, '123456')
		expect(sut.execute('marco', email, '123456')).rejects.instanceOf(UserAlreadyExistsError)
	})
})
