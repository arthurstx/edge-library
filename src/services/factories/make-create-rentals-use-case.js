import { D1BooksRepository } from 'src/repository/d1-books-repository'
import { D1RentalsRepository } from 'src/repository/d1-rentals-repository'
import { D1UsersRepository } from 'src/repository/d1-users-repository'
import { CreateRentalUseCase } from '../create-rentals.use-case'

export function makeCreateRentalsUseCase(d1) {
	const booksRepository = new D1BooksRepository(d1)
	const userRepository = new D1UsersRepository(d1)
	const rentalsRepository = new D1RentalsRepository(d1)
	const useCase = new CreateRentalUseCase(d1, booksRepository, userRepository, rentalsRepository)
	return useCase
}
