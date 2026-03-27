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
	/**
	 *
	 * @param {{ id?: string, name: string, email: string, password_hash: string }} params
	 */
	async create({ id, name, email, password_hash }) {
		const user = {
			id: id ?? crypto.randomUUID(),
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

	async countNonAdmin() {
		return this.users.filter((user) => user.role !== 'admin').length
	}

	async countWithActiveRentals() {
		// Mock implementation for tests. Tests should use vi.spyOn to mock the return value
		// since InMemoryUsersRepository does not have access to rentals.
		return 0
	}

	async fetchAll({ query, page = 1 }) {
		let filtered = this.users.filter((user) => user.role !== 'admin')

		if (query) {
			const normalizedQuery = query.toLowerCase()
			filtered = filtered.filter(
				(user) => user.name.toLowerCase().includes(normalizedQuery) || user.email.toLowerCase().includes(normalizedQuery)
			)
		}

		// exclude password_hash
		const mapped = filtered.map(user => ({
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			created_at: user.created_at,
		}))

		return mapped.slice((page - 1) * 10, page * 10)
	}
}
