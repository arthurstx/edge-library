import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from 'src/repository/in-memory-repositorys/in-memory-users-repository.js'
import { ListUsersUseCase } from './list-users.use-case.js'

/**
 * @typedef {import('../repository/in-memory-repositorys/in-memory-users-repository.js').InMemoryUsersRepository} InMemoryUsersRepository
 */

/**@type {InMemoryUsersRepository} */
let usersRepository
/** @type {ListUsersUseCase} */
let sut

describe('list users Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new ListUsersUseCase(usersRepository)
	})

	it('should list users with pagination, excluding admins and password_hash', async () => {
		await usersRepository.create({ name: 'User 1', email: 'user1@test.com', password_hash: '123' })
		await usersRepository.create({ name: 'User 2', email: 'user2@test.com', password_hash: '123' })
		await usersRepository.create({ name: 'Admin', email: 'admin@test.com', password_hash: '123' })
		usersRepository.users[2].role = 'admin'

		const { users } = await sut.execute({ page: 1 })
		expect(users).toHaveLength(2)
		expect(users[0]).not.toHaveProperty('password_hash')
		expect(users[1]).not.toHaveProperty('password_hash')
		expect(users[0].name).toBe('User 1')
	})
})
