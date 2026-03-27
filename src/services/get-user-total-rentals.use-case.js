/**
 * @typedef {import('../repository/d1-rentals-repository.js').D1RentalsRepository} RentalsRepository
 */

export class GetUserTotalRentalsUseCase {
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
		const total = await this.rentalsRepository.countByUserId({ userId })
		return { total }
	}
}
