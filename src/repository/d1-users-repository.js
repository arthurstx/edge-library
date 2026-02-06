/**
 * @typedef {import('../types/schema.d.ts').User} User
 */
export class D1UsersRepository {
	constructor(db) {
		this.db = db
	}
	/**
	 *
	 * @param {string} email
	 * @returns {Promise<User|null>}
	 */
	async findByEmail(email) {
		const query = 'SELECT * FROM users WHERE email = ? LIMIT 1'
		const result = await this.db.prepare(query).bind(email).first()
		return result ? result : null
	}

	async create(name, email, password_hash) {
		const id = crypto.randomUUID()
		const created_at = new Date().toISOString()
		const role = 'admin'
		const query = 'INSERT INTO users (id, name,email, password_hash, created_at, role) VALUES (?, ?, ?, ?, ?, ?)'
		await this.db.prepare(query).bind(id, name, email, password_hash, created_at, role).run()
		return { id, name, email, password_hash, created_at, role }
	}
}
