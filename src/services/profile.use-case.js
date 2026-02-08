import { ResourceNotFoundError } from 'src/errors/resource-not-found-error'

/**
 * @typedef {import('../repository/d1-users-repository.js').D1UsersRepository} UsersRepository
 * @typedef {import('../types/schema.js').User} User
 */

export class ProfileUseCase {
	/**
	 * @param {UsersRepository} usersRepository
	 */
	constructor(usersRepository) {
		this.usersRepository = usersRepository
	}
	/**
	 * @param {string} userId
	 * @returns {Promise<{ user: User }>}
	 */
	async execute(userId) {
		const user = await this.usersRepository.findById(userId)
		if (!user) {
			throw new ResourceNotFoundError()
		}

		return { user }
	}
}
