/*
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/
export class D1UsersRepository {
	constructor(db) {
		this.db = db
	}
	async findByEmail(email) {
		const query = 'SELECT * FROM users WHERE email = ? LIMIT 1'
		const result = await this.db.prepare(query).bind(email).first()
		return result ? result : null
	}

	async create(name, email, password_hash) {
		const id = crypto.randomUUID()
		const created_at = new Date().toISOString()
		const query = 'INSERT INTO users (id, name,email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)'
		await this.db.prepare(query).bind(id, name, email, password_hash, created_at).run()
		return { id, name, email, password_hash, created_at }
	}
}
