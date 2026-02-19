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
		const rental = await this.rentalsRepository.fetchManyByUserId({ userId })
		return {
			rental,
		}
	}
}
