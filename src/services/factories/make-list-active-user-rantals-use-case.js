import { D1RentalsRepository } from 'src/repository/d1-rentals-repository'
import { ListActiveUserRentalsUseCase } from '../list-active-user-rentals.use-case'

export function makeListActiveUserRentalsUseCase(db) {
	const rentalsRepository = new D1RentalsRepository(db)
	const useCase = new ListActiveUserRentalsUseCase(rentalsRepository)

	return useCase
}
