/**
 * @typedef {import('../d1-rentals-repository').D1RentalsRepository} D1RentalsRepository
 * @typedef {import('../../types/schema').Rental} Rental
 */

/**
 * @implements {D1RentalsRepository}
 */

export class InMemoryRentalsRepository {
	constructor() {
		/** @type {Rental[]} */
		this.rentals = []
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
