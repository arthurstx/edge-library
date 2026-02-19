import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryRentalsRepository } from 'src/repository/in-memory-repositorys/in-memory-rentals-repository.js'
import { UpdateRentalStatusUseCase } from './update-rentals-status.use-case.js'
import { RentalNotFoundError } from 'src/errors/rental-not-found-error.js'

/**
 * @typedef {import('../repository/in-memory-repositorys/in-memory-rentals-repository.js').InMemoryRentalsRepository} InMemoryRentalsRepository
 */

/**@type {InMemoryRentalsRepository} */
let rentalRepository
/** @type {UpdateRentalStatusUseCase} */
let sut

describe('Update Rental Status Use Case', () => {
	beforeEach(() => {
		rentalRepository = new InMemoryRentalsRepository()
		sut = new UpdateRentalStatusUseCase(rentalRepository)
	})

	it('should be able to update rental status', async () => {
		rentalRepository.createPreparedStatement({
			id: 'rental-1',
			userId: 'user-1',
			bookId: 'book-1',
			status: 'rented',
			startDate: new Date('2026-02-10T10:00:00.000Z').toISOString(),
			endDate: new Date('2026-02-17T10:00:00.000Z').toISOString(),
		})

		const { result } = await sut.execute({
			id: 'rental-1',
			userId: 'user-1',
		})

		expect(result).toBe(true)
	})

	it('should not be able to update rental status with wrong rental id', async () => {
		rentalRepository.createPreparedStatement({
			id: 'rental-1',
			userId: 'user-1',
			bookId: 'book-1',
			status: 'rented',
			startDate: new Date('2026-02-10T10:00:00.000Z').toISOString(),
			endDate: new Date('2026-02-17T10:00:00.000Z').toISOString(),
		})

		await expect(
			sut.execute({
				id: 'rental-2',
				userId: 'user-1',
			}),
		).rejects.toBeInstanceOf(RentalNotFoundError)
	})

	it('should not be able to update rental status with wrong user id', async () => {
		rentalRepository.createPreparedStatement({
			id: 'rental-1',
			userId: 'user-1',
			bookId: 'book-1',
			status: 'rented',
			startDate: new Date('2026-02-10T10:00:00.000Z').toISOString(),
			endDate: new Date('2026-02-17T10:00:00.000Z').toISOString(),
		})

		await expect(
			sut.execute({
				id: 'rental-1',
				userId: 'user-2',
			}),
		).rejects.toBeInstanceOf(RentalNotFoundError)
	})
})
