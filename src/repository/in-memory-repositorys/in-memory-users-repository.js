/**
 * @typedef {import('../d1-users-repository').D1UsersRepository} D1UsersRepository
 * @typedef {import('../../types/schema').User} User
 */

/**
 * @implements {D1UsersRepository}
 */

export class InMemoryUsersRepository {
	constructor() {
		/**@type {User[]} */
		this.users = []
	}

	async create(name, email, password_hash) {
		const user = {
			id: crypto.randomUUID(),
			name,
			email,
			created_at: new Date(),
			password_hash,
			role: 'user',
		}
		this.users.push(user)
		return user
	}

	async findByEmail(email) {
		const user = this.users.find((user) => user.email === email)
		return user ? user : null
	}

	async findById(id) {
		const user = this.users.find((user) => user.id === id)
		return user ? user : null
	}
}
