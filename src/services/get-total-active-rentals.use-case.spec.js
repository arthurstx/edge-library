import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryRentalsRepository } from 'src/repository/in-memory-repositorys/in-memory-rentals-repository.js'
import { GetTotalActiveRentalsUseCase } from './get-total-active-rentals.use-case.js'

/**
 * @typedef {import('../repository/in-memory-repositorys/in-memory-rentals-repository.js').InMemoryRentalsRepository} InMemoryRentalsRepository
 */

/**@type {InMemoryRentalsRepository} */
let rentalsRepository
/** @type {GetTotalActiveRentalsUseCase} */
let sut

describe('get total active rentals Use Case', () => {
	beforeEach(() => {
		rentalsRepository = new InMemoryRentalsRepository()
		sut = new GetTotalActiveRentalsUseCase(rentalsRepository)
	})

	it('should return the correct count of active rentals', async () => {
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
			userId: 'user-2',
			bookId: 'book-2',
			status: 'returned',
			startDate: new Date().toISOString(),
			endDate: new Date().toISOString(),
		})

		const { total } = await sut.execute()
		expect(total).toBe(1)
	})
})
