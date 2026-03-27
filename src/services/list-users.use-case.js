/**
 * @typedef {import('../repository/d1-users-repository.js').D1UsersRepository} UsersRepository
 */

export class ListUsersUseCase {
	/**
	 * @param {UsersRepository} usersRepository
	 */
	constructor(usersRepository) {
		this.usersRepository = usersRepository
	}

	/**
	 * @param {{ query?: string, page?: number }} params
	 */
	async execute({ query, page }) {
		const users = await this.usersRepository.fetchAll({ query, page })

		return { users }
	}
}
