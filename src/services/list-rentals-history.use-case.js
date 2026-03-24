/**
 * @typedef {import('../repository/d1-rentals-repository.js').D1RentalsRepository} RentalsRepository
 * @typedef {import('../types/schema.js').Rental} Rental
 *
 */

export class ListRentalsHistoryUseCase {
	/**
	 * @param {RentalsRepository} rentalsRepository
	 */
	constructor(rentalsRepository) {
		this.rentalsRepository = rentalsRepository
	}
	/**
	 * @param {{ userId: string, page?: number }} params
	 * @returns {Promise<{ rental: Rental[] }>}
	 */
	async execute({ userId, page }) {
		const rental = await this.rentalsRepository.fetchManyByUserId({ userId, page })

		const rentals = rental.map((rental) => {
			return {
				id: rental.id,
				book: {
					title: rental.title,
					author: rental.author,
					category: rental.category,
				},
				status: rental.status,
				startDate: rental.start_date,
				endDate: rental.end_date,
			}
		})

		return {
			rentals,
		}
	}
}
