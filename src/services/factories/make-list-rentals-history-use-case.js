import { D1RentalsRepository } from 'src/repository/d1-rentals-repository'
import { ListRentalsHistoryUseCase } from '../list-rentals-history.use-case'

export function makeListRentalsHistoryUseCase(db) {
	const rentalsRepository = new D1RentalsRepository(db)
	const useCase = new ListRentalsHistoryUseCase(rentalsRepository)

	return useCase
}
