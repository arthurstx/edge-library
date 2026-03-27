import { D1RentalsRepository } from 'src/repository/d1-rentals-repository.js'
import { GetUserTotalRentalsUseCase } from 'src/services/get-user-total-rentals.use-case.js'

export function makeGetUserTotalRentalsUseCase(db) {
	const rentalsRepository = new D1RentalsRepository(db)
	return new GetUserTotalRentalsUseCase(rentalsRepository)
}
