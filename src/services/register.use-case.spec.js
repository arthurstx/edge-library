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
let usersRepository
/** @type {RegisterUseCase} */
let sut

describe('Register Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new RegisterUseCase(usersRepository)
	})

	it('should be able to register a new user', async () => {
		const { user } = await sut.execute({ name: 'John Doe', email: 'jhonDoe@example.com', password: 'password123' })
		expect(user.id).toEqual(expect.any(String))
	})

	it('Should hash user password upon registration', async () => {
		const { user } = await sut.execute({ name: 'John Doe', email: 'jhonDoe@example.com', password: '123456' })

		const isPasswordCorrectlyHashed = await verifyPassword('123456', user.password_hash)
		expect(isPasswordCorrectlyHashed).toBe(true)
	})
	it('Should not be able to registration with same email twice', async () => {
		const email = 'jhonDoe@example.com'
		await sut.execute({ name: 'John Doe', email, password: '123456' })
		await expect(sut.execute({ name: 'marco', email, password: '123456' })).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})
