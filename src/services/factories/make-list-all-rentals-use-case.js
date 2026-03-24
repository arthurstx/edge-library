import { D1RentalsRepository } from 'src/repository/d1-rentals-repository'
import { ListAllRentalsUseCase } from '../list-all-rentals.use-case'

export function makeListAllRentalsUseCase(db) {
	const rentalsRepository = new D1RentalsRepository(db)
	const useCase = new ListAllRentalsUseCase(rentalsRepository)

	return useCase
}
