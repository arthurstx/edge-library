import { hashPassword } from 'src/auth/crypto'
import { UserAlreadyExistsError } from 'src/errors/user-already-exists-error'

/**
 * @typedef {import('../repository/d1-users-repository.js').D1UsersRepository} UsersRepository
 * @typedef {import('../types/schema.d.ts').User} User
 */

export class RegisterUseCase {
	/**
	 * @param {UsersRepository} usersRepository
	 */
	constructor(usersRepository) {
		this.usersRepository = usersRepository
	}
	/**
	 *@param {string} name
	 * @param {string} email
	 * @param {string} password
	 * @returns {Promise<{ user: User }>}
	 */
	async execute(name, email, password) {
		const password_hash = await hashPassword(password)
		const userWithSameEmail = await this.usersRepository.findByEmail(email)
		console.log('passou')
		if (userWithSameEmail) {
			throw new UserAlreadyExistsError()
		}

		const user = await this.usersRepository.create(name, email, password_hash)
		return { user }
	}
}
