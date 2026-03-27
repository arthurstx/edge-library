import { D1RentalsRepository } from 'src/repository/d1-rentals-repository.js'
import { GetTotalActiveRentalsUseCase } from 'src/services/get-total-active-rentals.use-case.js'

export function makeGetTotalActiveRentalsUseCase(db) {
	const rentalsRepository = new D1RentalsRepository(db)
	return new GetTotalActiveRentalsUseCase(rentalsRepository)
}
