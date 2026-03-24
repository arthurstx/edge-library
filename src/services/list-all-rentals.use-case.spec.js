import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryRentalsRepository } from 'src/repository/in-memory-repositorys/in-memory-rentals-repository.js'
import { InMemoryBooksRepository } from 'src/repository/in-memory-repositorys/in-memory-books-repository.js'
import { InMemoryUsersRepository } from 'src/repository/in-memory-repositorys/in-memory-users-repository.js'
import { ListAllRentalsUseCase } from './list-all-rentals.use-case.js'

/**
 * @typedef {import('../repository/in-memory-repositorys/in-memory-rentals-repository.js').InMemoryRentalsRepository} InMemoryRentalsRepository
 */

/**@type {InMemoryRentalsRepository} */
let rentalRepository
/** @type {ListAllRentalsUseCase} */
let sut
let booksRepository
let usersRepository

describe('List All Rentals Use Case', () => {
	beforeEach(() => {
		booksRepository = new InMemoryBooksRepository()
		usersRepository = new InMemoryUsersRepository()
		rentalRepository = new InMemoryRentalsRepository(booksRepository, usersRepository)
		sut = new ListAllRentalsUseCase(rentalRepository)
	})

	it('should be able to list all rentals', async () => {
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
			userId: 'user-2',
			bookId: 'book-2',
			status: 'returned',
			startDate: new Date('2026-02-01T10:00:00.000Z').toISOString(),
			endDate: new Date('2026-02-08T10:00:00.000Z').toISOString(),
		})

		const { rentals } = await sut.execute({ page: 1 })

		expect(rentals).toHaveLength(2)
		expect(rentals).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'rental-1' }),
				expect.objectContaining({ id: 'rental-2' }),
			]),
		)
	})

	it('should return an empty array if no rentals exist', async () => {
		const { rentals } = await sut.execute({ page: 1 })

		expect(rentals).toEqual([])
	})

	it('should return paginated rentals (10 per page)', async () => {
		for (let i = 1; i <= 12; i++) {
			rentalRepository.createPreparedStatement({
				id: `rental-${i}`,
				userId: `user-${i}`,
				bookId: `book-${i}`,
				status: 'rented',
				startDate: new Date('2026-02-10T10:00:00.000Z').toISOString(),
				endDate: new Date('2026-02-17T10:00:00.000Z').toISOString(),
			})
		}

		const { rentals } = await sut.execute({ page: 2 })

		expect(rentals).toHaveLength(2)
		expect(rentals[0].id).toBe('rental-11')
		expect(rentals[1].id).toBe('rental-12')
	})

	it('should filter rentals by user name', async () => {
		await usersRepository.create({ id: 'user-1', name: 'Alice', email: 'alice@test.com', password_hash: 'hash' })
		await usersRepository.create({ id: 'user-2', name: 'Bob', email: 'bob@test.com', password_hash: 'hash' })

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
			userId: 'user-2',
			bookId: 'book-2',
			status: 'rented',
			startDate: new Date('2026-02-10T10:00:00.000Z').toISOString(),
			endDate: new Date('2026-02-17T10:00:00.000Z').toISOString(),
		})

		const { rentals } = await sut.execute({ query: 'Alice', page: 1 })

		expect(rentals).toHaveLength(1)
		expect(rentals[0].id).toBe('rental-1')
	})

	it('should filter rentals by book title', async () => {
		await booksRepository.create({ id: 'book-1', title: 'Clean Code', author: 'Author 1', category: 'Tech' })
		await booksRepository.create({ id: 'book-2', title: 'Domain Driven Design', author: 'Author 2', category: 'Tech' })

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
			status: 'rented',
			startDate: new Date('2026-02-10T10:00:00.000Z').toISOString(),
			endDate: new Date('2026-02-17T10:00:00.000Z').toISOString(),
		})

		const { rentals } = await sut.execute({ query: 'Clean', page: 1 })

		expect(rentals).toHaveLength(1)
		expect(rentals[0].id).toBe('rental-1')
	})
})
