/**
 * @typedef {import('../d1-rentals-repository').D1RentalsRepository} D1RentalsRepository
 * @typedef {import('../../types/schema').Rental} Rental
 * @typedef {import('./in-memory-books-repository').InMemoryBooksRepository} InMemoryBooksRepository
 * @typedef {import('./in-memory-users-repository').InMemoryUsersRepository} InMemoryUsersRepository
 */

/**
 * @implements {D1RentalsRepository}
 */

export class InMemoryRentalsRepository {
	/**
	 * @param {InMemoryBooksRepository} [booksRepository]
	 * @param {InMemoryUsersRepository} [usersRepository]
	 */
	constructor(booksRepository, usersRepository) {
		/** @type {Rental[]} */
		this.rentals = []
		this.booksRepository = booksRepository ?? null
		this.usersRepository = usersRepository ?? null
	}

	/**
	 * @param {{ id?: string, userId: string, bookId: string, startDate: string, status: string, endDate: string }} params
	 */
	createPreparedStatement({ id, userId, bookId, startDate, status, endDate }) {
		const rental = {
			id: id ?? crypto.randomUUID(),
			userId,
			bookId,
			status,
			start_date: startDate,
			end_date: endDate,
		}

		this.rentals.push(rental)

		return { rental }
	}

	async fetchAll({ query, page = 1 }) {
		let filtered = this.rentals

		if (query) {
			const normalizedQuery = query.toLowerCase()
			filtered = []

			for (const rental of this.rentals) {
				const user = this.usersRepository ? await this.usersRepository.findById(rental.userId) : null
				const book = this.booksRepository ? await this.booksRepository.findById(rental.bookId) : null

				const matchesUserName = user?.name?.toLowerCase().includes(normalizedQuery)
				const matchesBookTitle = book?.title?.toLowerCase().includes(normalizedQuery)

				if (matchesUserName || matchesBookTitle) {
					filtered.push(rental)
				}
			}
		}

		const results = filtered.slice((page - 1) * 10, page * 10)

		return results
	}

	async fetchManyByUserId({ userId }) {
		return this.rentals.filter((rental) => rental.userId === userId)
	}

	async fetchManyActiveByUserId({ userId }) {
		return this.rentals.filter((rental) => rental.userId === userId && rental.status === 'rented')
	}

	async updateStatus({ userId, id }) {
		const rentalIndex = this.rentals.findIndex((rental) => rental.userId === userId && rental.id === id)

		if (rentalIndex === -1) {
			return { meta: { changed_db: false } }
		}

		this.rentals[rentalIndex].status = 'returned'

		return { meta: { changed_db: true } }
	}
}
