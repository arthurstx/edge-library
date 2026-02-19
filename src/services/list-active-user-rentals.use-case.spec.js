import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryRentalsRepository } from 'src/repository/in-memory-repositorys/in-memory-rentals-repository.js'
import { ListActiveUserRentalsUseCase } from './list-active-user-rentals.use-case.js'

/**
 * @typedef {import('../repository/in-memory-repositorys/in-memory-rentals-repository.js').InMemoryRentalsRepository} InMemoryRentalsRepository
 */

/**@type {InMemoryRentalsRepository} */
let rentalRepository
/** @type {ListActiveUserRentalsUseCase} */
let sut

describe('list active user rentals Use Case', () => {
	beforeEach(() => {
		rentalRepository = new InMemoryRentalsRepository()
		sut = new ListActiveUserRentalsUseCase(rentalRepository)
	})

	it('should be able to find rentals', async () => {
		rentalRepository.createPreparedStatement({
			id: 'rental-1',
			userId: 'user-1',
			bookId: 'book-1',
			status: 'rented',
			startDate: new Date('2026-02-10T10:00:00.000Z').toISOString(),
			endDate: new Date('2026-02-17T10:00:00.000Z').toISOString(),
		})

		rentalRepository.createPreparedStatement({
			id: 'rental-2',
			userId: 'user-1',
			bookId: 'book-2',
			status: 'returned',
			startDate: new Date('2026-02-01T10:00:00.000Z').toISOString(),
			endDate: new Date('2026-02-08T10:00:00.000Z').toISOString(),
		})

		rentalRepository.createPreparedStatement({
			id: 'rental-3',
			userId: 'user-2',
			bookId: 'book-3',
			status: 'rented',
			startDate: new Date('2026-02-11T10:00:00.000Z').toISOString(),
			endDate: new Date('2026-02-18T10:00:00.000Z').toISOString(),
		})

		const { rental } = await sut.execute({
			userId: 'user-1',
		})

		expect(rental).toHaveLength(1)
		expect(rental).toEqual([
			expect.objectContaining({
				id: 'rental-1',
				userId: 'user-1',
				bookId: 'book-1',
				status: 'rented',
			}),
		])
	})
})
