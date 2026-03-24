/**
 * @typedef {import('../repository/d1-rentals-repository.js').D1RentalsRepository} RentalsRepository
 * @typedef {import('../types/schema.js').Rental} Rental
 *
 */

export class ListAllRentalsUseCase {
	/**
	 * @param {RentalsRepository} rentalsRepository
	 */
	constructor(rentalsRepository) {
		this.rentalsRepository = rentalsRepository
	}
	/**
	 * @param {{ query?: string, page?: number }} params
	 * @returns {Promise<{ rentals: Rental[] }>}
	 */
	async execute({ query, page }) {
		const rentals = await this.rentalsRepository.fetchAll({ query, page })

		const formattedRentals = rentals.map((rental) => {
			return {
				...rental,
				book: {
					title: rental.bookTitle,
					author: rental.author,
					category: rental.category,
				},
			}
		})

		return {
			rentals: formattedRentals,
		}
	}
}
