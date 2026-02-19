import { D1RentalsRepository } from 'src/repository/d1-rentals-repository'
import { UpdateRentalStatusUseCase } from './update-rentals-status.use-case'

export function makeUpdateRentalStatusUseCase(db) {
	const rentalsRepository = new D1RentalsRepository(db)
	const useCase = new UpdateRentalStatusUseCase(rentalsRepository)

	return useCase
}
