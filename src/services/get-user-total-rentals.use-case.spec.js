import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryRentalsRepository } from 'src/repository/in-memory-repositorys/in-memory-rentals-repository.js'
import { GetUserTotalRentalsUseCase } from './get-user-total-rentals.use-case.js'

/**
 * @typedef {import('../repository/in-memory-repositorys/in-memory-rentals-repository.js').InMemoryRentalsRepository} InMemoryRentalsRepository
 */

/**@type {InMemoryRentalsRepository} */
let rentalsRepository
/** @type {GetUserTotalRentalsUseCase} */
let sut

describe('get user total rentals Use Case', () => {
	beforeEach(() => {
		rentalsRepository = new InMemoryRentalsRepository()
		sut = new GetUserTotalRentalsUseCase(rentalsRepository)
	})

	it('should return the correct count for user total rentals', async () => {
		rentalsRepository.createPreparedStatement({
			id: 'rental-1',
			userId: 'user-1',
			bookId: 'book-1',
			status: 'rented',
			startDate: new Date().toISOString(),
			endDate: new Date().toISOString(),
		})

		rentalsRepository.createPreparedStatement({
			id: 'rental-2',
			userId: 'user-1',
			bookId: 'book-2',
			status: 'returned',
			startDate: new Date().toISOString(),
			endDate: new Date().toISOString(),
		})

		rentalsRepository.createPreparedStatement({
			id: 'rental-3',
			userId: 'user-2',
			bookId: 'book-2',
			status: 'rented',
			startDate: new Date().toISOString(),
			endDate: new Date().toISOString(),
		})

		const { total } = await sut.execute({ userId: 'user-1' })
		expect(total).toBe(2)
	})
})
