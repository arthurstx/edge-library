/**
 * @typedef {import('../repository/d1-rentals-repository.js').D1RentalsRepository} RentalsRepository
 */

export class GetTotalActiveRentalsUseCase {
	/**
	 * @param {RentalsRepository} rentalsRepository
	 */
	constructor(rentalsRepository) {
		this.rentalsRepository = rentalsRepository
	}

	async execute() {
		const total = await this.rentalsRepository.countActive()
		return { total }
	}
}
