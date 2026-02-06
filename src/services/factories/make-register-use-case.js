import { D1UsersRepository } from 'src/repository/d1-users-repository'
import { RegisterUseCase } from '../register.use-case'

export function makeRegisterUseCase(db) {
	const usersRepository = new D1UsersRepository(db)
	const useCase = new RegisterUseCase(usersRepository)
	return useCase
}
