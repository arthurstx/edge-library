import { D1UsersRepository } from 'src/repository/d1-users-repository'
import { AuthenticateUseCase } from 'src/services/authenticate.use-case.js'

export function makeAuthenticateUseCase(db) {
	const usersRepository = new D1UsersRepository(db)
	const useCase = new AuthenticateUseCase(usersRepository)
	return useCase
}
