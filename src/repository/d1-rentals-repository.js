export class D1RentalsRepository {
	/**
	 * @param {D1Database} database
	 */
	constructor(database) {
		this.database = database
	}

	createPreparedStatement({ id, userId, bookId, startDate, status, endDate }) {
		//const status = 'rented'
		const query = 'INSERT INTO rentals (id, user_id, book_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?)'
		return this.database.prepare(query).bind(id, userId, bookId, startDate, endDate, status)
		/*const rental = { id, userId, bookId, status, startDate, endDate }
		return { rental, D1PreparedStatement }*/
	}

	async fetchManyActiveByUserId({ userId }) {
		const query = `SELECT r.id, b.title, b.author, b.category,r.status, r.start_date, r.end_date 
		FROM rentals as r INNER JOIN books as b on r.book_id = b.id 
		WHERE r.user_id = ? AND r.status = 'rented'`
		const rentals = await this.database.prepare(query).bind(userId).all()

		return rentals.results
	}

	async fetchManyByUserId({ userId, page = 1 }) {
		const query = `SELECT r.id, b.title, b.author, b.category,r.status, r.start_date, r.end_date 
		FROM rentals as r INNER JOIN books as b on r.book_id = b.id 
		WHERE r.user_id = ? 
		LIMIT 10 OFFSET ?`
		const offset = (page - 1) * 10
		const rentals = await this.database.prepare(query).bind(userId, offset).all()

		return rentals.results
	}

	async updateStatus({ userId, id }) {
		const query = `UPDATE rentals SET status = 'returned' 
		WHERE user_id = ? AND id = ?`
		return await this.database.prepare(query).bind(userId, id).run()
	}
}
