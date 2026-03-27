/**
 * @typedef {import('../repository/d1-users-repository.js').D1UsersRepository} UsersRepository
 */

export class GetTotalUsersWithActiveRentalsUseCase {
	/**
	 * @param {UsersRepository} usersRepository
	 */
	constructor(usersRepository) {
		this.usersRepository = usersRepository
	}

	async execute() {
		const total = await this.usersRepository.countWithActiveRentals()
		return { total }
	}
}
