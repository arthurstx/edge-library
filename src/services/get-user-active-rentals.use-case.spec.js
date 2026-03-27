import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryRentalsRepository } from 'src/repository/in-memory-repositorys/in-memory-rentals-repository.js'
import { GetUserActiveRentalsUseCase } from './get-user-active-rentals.use-case.js'

/**
 * @typedef {import('../repository/in-memory-repositorys/in-memory-rentals-repository.js').InMemoryRentalsRepository} InMemoryRentalsRepository
 */

/**@type {InMemoryRentalsRepository} */
let rentalsRepository
/** @type {GetUserActiveRentalsUseCase} */
let sut

describe('get user active rentals Use Case', () => {
	beforeEach(() => {
		rentalsRepository = new InMemoryRentalsRepository()
		sut = new GetUserActiveRentalsUseCase(rentalsRepository)
	})

	it('should return the correct count for user active rentals', async () => {
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
		expect(total).toBe(1)
	})
})
