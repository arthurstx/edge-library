import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryUsersRepository } from 'src/repository/in-memory-repositorys/in-memory-users-repository.js'
import { GetTotalUsersWithActiveRentalsUseCase } from './get-total-users-with-active-rentals.use-case.js'

/**
 * @typedef {import('../repository/in-memory-repositorys/in-memory-users-repository.js').InMemoryUsersRepository} InMemoryUsersRepository
 */

/**@type {InMemoryUsersRepository} */
let usersRepository
/** @type {GetTotalUsersWithActiveRentalsUseCase} */
let sut

describe('get total users with active rentals Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new GetTotalUsersWithActiveRentalsUseCase(usersRepository)
	})

	it('should return the mocked count for users with active rentals', async () => {
		vi.spyOn(usersRepository, 'countWithActiveRentals').mockResolvedValue(5)

		const { total } = await sut.execute()
		expect(total).toBe(5)
	})
})
