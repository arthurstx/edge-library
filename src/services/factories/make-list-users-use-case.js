import { D1UsersRepository } from 'src/repository/d1-users-repository.js'
import { ListUsersUseCase } from 'src/services/list-users.use-case.js'

export function makeListUsersUseCase(db) {
	const usersRepository = new D1UsersRepository(db)
	return new ListUsersUseCase(usersRepository)
}
