import { D1UsersRepository } from 'src/repository/d1-users-repository.js'
import { GetTotalNonAdminUsersUseCase } from 'src/services/get-total-non-admin-users.use-case.js'

export function makeGetTotalNonAdminUsersUseCase(db) {
	const usersRepository = new D1UsersRepository(db)
	return new GetTotalNonAdminUsersUseCase(usersRepository)
}
