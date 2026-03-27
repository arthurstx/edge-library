import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from 'src/repository/in-memory-repositorys/in-memory-users-repository.js'
import { GetTotalNonAdminUsersUseCase } from './get-total-non-admin-users.use-case.js'

/**
 * @typedef {import('../repository/in-memory-repositorys/in-memory-users-repository.js').InMemoryUsersRepository} InMemoryUsersRepository
 */

/**@type {InMemoryUsersRepository} */
let usersRepository
/** @type {GetTotalNonAdminUsersUseCase} */
let sut

describe('get total non admin users Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new GetTotalNonAdminUsersUseCase(usersRepository)
	})

	it('should return the correct count of non-admin users', async () => {
		await usersRepository.create({ name: 'User 1', email: 'user1@test.com', password_hash: '123' })
		await usersRepository.create({ name: 'User 2', email: 'user2@test.com', password_hash: '123' })
		await usersRepository.create({ name: 'Admin', email: 'admin@test.com', password_hash: '123' })

		usersRepository.users[2].role = 'admin'

		const { total } = await sut.execute()
		expect(total).toBe(2)
	})
})
