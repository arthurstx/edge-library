import { verifyPassword } from 'src/auth/crypto'
import { InvalidCredentialsError } from 'src/errors/invalid-credentials-error'

/**
 * @typedef {import('../repository/d1-users-repository.js').D1UsersRepository} UsersRepository
 * @typedef {import('../types/schema.js').User} User
 */

export class AuthenticateUseCase {
	/**
	 * @param {UsersRepository} usersRepository
	 */
	constructor(usersRepository) {
		this.usersRepository = usersRepository
	}

	/**
	 * @param {{ email: string, password: string }} params
	 * @returns {Promise<{ user: User }>}
	 */
	async execute({ email, password }) {
		const user = await this.usersRepository.findByEmail(email)

		if (!user) {
			throw new InvalidCredentialsError()
		}

		const isPasswordValid = await verifyPassword(password, user.password_hash)

		if (!isPasswordValid) {
			throw new InvalidCredentialsError()
		}

		return { user }
	}
}
