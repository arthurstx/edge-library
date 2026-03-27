/**
 * @typedef {import('../repository/d1-users-repository.js').D1UsersRepository} UsersRepository
 */

export class GetTotalNonAdminUsersUseCase {
	/**
	 * @param {UsersRepository} usersRepository
	 */
	constructor(usersRepository) {
		this.usersRepository = usersRepository
	}

	async execute() {
		const total = await this.usersRepository.countNonAdmin()
		return { total }
	}
}
