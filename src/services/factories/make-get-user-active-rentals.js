import { D1RentalsRepository } from 'src/repository/d1-rentals-repository.js'
import { GetUserActiveRentalsUseCase } from 'src/services/get-user-active-rentals.use-case.js'

export function makeGetUserActiveRentalsUseCase(db) {
	const rentalsRepository = new D1RentalsRepository(db)
	return new GetUserActiveRentalsUseCase(rentalsRepository)
}
