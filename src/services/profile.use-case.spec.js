import { InMemoryUsersRepository } from 'src/repository/in-memory-repositorys/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { hashPassword } from 'src/auth/crypto'
import { ProfileUseCase } from './profile.use-case'
import { ResourceNotFoundError } from 'src/errors/resource-not-found-error'

/**
 * @typedef {import('../services/profile.use-case.js').ProfileUseCase} ProfileUseCase
 * @typedef {import('../repository/in-memory-repositorys/in-memory-users-repository.js').InMemoryUsersRepository} InMemoryUsersRepository
 */

/**@type {InMemoryUsersRepository} */
let usersRepository
/** @type {ProfileUseCase} */
let sut

describe('Profile Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new ProfileUseCase(usersRepository)
	})

	it('should be able get profile', async () => {
		const userId = 'user-id'
		await usersRepository.create({
			id: userId,
			name: 'John Doe',
			email: 'jhonDoe@example.com',
			password_hash: await hashPassword('password123'),
		})

		const { user } = await sut.execute(userId)
		expect(user.name).toEqual('John Doe')
	})

	it('Should not be able get profile with wrong id', async () => {
		const userId = 'user-id'
		await usersRepository.create({
			id: userId,
			name: 'John Doe',
			email: 'jhonDoe@example.com',
			password_hash: await hashPassword('password123'),
		})

		await expect(sut.execute('wrong-user-id')).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})
