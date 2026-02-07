import { D1UsersRepository } from 'src/repository/d1-users-repository'
import { ProfileUseCase } from '../profile.use-case'

export function makeProfileUseCase(db) {
	const usersRepository = new D1UsersRepository(db)
	const useCase = new ProfileUseCase(usersRepository)
	return useCase
}
