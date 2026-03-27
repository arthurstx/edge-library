import { D1UsersRepository } from 'src/repository/d1-users-repository.js'
import { GetTotalUsersWithActiveRentalsUseCase } from 'src/services/get-total-users-with-active-rentals.use-case.js'

export function makeGetTotalUsersWithActiveRentalsUseCase(db) {
	const usersRepository = new D1UsersRepository(db)
	return new GetTotalUsersWithActiveRentalsUseCase(usersRepository)
}
