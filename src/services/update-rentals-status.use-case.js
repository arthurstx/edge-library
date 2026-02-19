import { RentalNotFoundError } from 'src/errors/rental-not-found-error.js'
/**
 * @typedef {import('../repository/d1-rentals-repository.js').D1RentalsRepository} RentalsRepository
 * @typedef {import('../types/schema.js').Rental} Rental
 *
 */

export class UpdateRentalStatusUseCase {
	/**
	 * @param {RentalsRepository} rentalsRepository
	 */
	constructor(rentalsRepository) {
		this.rentalsRepository = rentalsRepository
	}
	/**
	 * @param {{ userId: string, id: number }} params
	 * @returns {Promise<{ result: boolean }>}
	 */
	async execute({ id, userId }) {
		const result = await this.rentalsRepository.updateStatus({ userId, id })

		if (!result.meta.changed_db) {
			throw new RentalNotFoundError()
		}
		return {
			result: result.meta.changed_db,
		}
	}
}
