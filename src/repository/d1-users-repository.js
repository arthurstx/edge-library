/**
 * @typedef {import('../types/schema.d.ts').User} User
 */
export class D1UsersRepository {
	/**
	 *
	 * @param {D1Database} db
	 */
	constructor(db) {
		this.db = db
	}
	/**
	 * @param {string} email
	 * @returns {Promise<User|null>}
	 */
	async findByEmail(email) {
		const query = 'SELECT * FROM users WHERE email = ? LIMIT 1'
		const result = await this.db.prepare(query).bind(email).first()
		return result ? result : null
	}
	/**
	 * @param {string} id
	 * @returns {Promise<User|null>}
	 */
	async findById(id) {
		const query = 'SELECT * FROM users WHERE id = ? LIMIT 1'
		const result = await this.db.prepare(query).bind(id).first()
		return result ? result : null
	}
	/**
	 *
	 * @param {{ name: string, email: string, password_hash: string, role?: string }} params
	 * @returns {Promise<User>}
	 */
	async create({ name, email, password_hash, role }) {
		const id = crypto.randomUUID()
		const created_at = new Date().toISOString()
		const query = 'INSERT INTO users (id, name,email, password_hash, created_at, role) VALUES (?, ?, ?, ?, ?, ?)'
		await this.db.prepare(query).bind(id, name, email, password_hash, created_at, role).run()
		return { id, name, email, password_hash, created_at, role }
	}

	/**
	 * @returns {Promise<number>}
	 */
	async countNonAdmin() {
		const query = `SELECT COUNT(*) as total FROM users 
		WHERE role != 'admin'`
		const result = await this.db.prepare(query).first()
		return result ? result.total : 0
	}

	/**
	 * @returns {Promise<number>}
	 */
	async countWithActiveRentals() {
		const query = `SELECT COUNT(DISTINCT user_id) as total FROM rentals 
		WHERE status = 'rented'`
		const result = await this.db.prepare(query).first()
		return result ? result.total : 0
	}

	/**
	 * @param {{ query?: string, page?: number }} params
	 * @returns {Promise<User[]>}
	 */
	async fetchAll({ query, page = 1 }) {
		const offset = (page - 1) * 10

		if (query) {
			const sqlQuery = `
				SELECT id, name, email, role, created_at 
				FROM users 
				WHERE role != 'admin' 
				AND (name LIKE '%' || ? || '%' OR email LIKE '%' || ? || '%')
				ORDER BY name ASC
				LIMIT 10 OFFSET ?
			`
			const result = await this.db.prepare(sqlQuery).bind(query, query, offset).all()
			return result.results
		}

		const sqlQuery = `
			SELECT id, name, email, role, created_at 
			FROM users 
			WHERE role != 'admin'
			ORDER BY name ASC
			LIMIT 10 OFFSET ?
		`
		const result = await this.db.prepare(sqlQuery).bind(offset).all()
		return result.results
	}
}
