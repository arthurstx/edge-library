/**
 * @typedef {import('../repository/d1-rentals-repository.js').D1RentalsRepository} RentalsRepository
 * @typedef {import('../types/schema.js').Rental} Rental
 *
 */

export class ListActiveUserRentalsUseCase {
	/**
	 * @param {RentalsRepository} rentalsRepository
	 */
	constructor(rentalsRepository) {
		this.rentalsRepository = rentalsRepository
	}
	/**
	 * @param {{ userId: string }} params
	 */
	async execute({ userId }) {
		const rental = await this.rentalsRepository.fetchManyActiveByUserId({ userId })

		console.log('Rental before', rental)

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
		console.log('rental after', rentals)

		return {
			rentals,
		}
	}
}
