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

	async fetchManyByUserId({ userId }) {
		const query = 'SELECT * FROM rentals WHERE user_id = ? AND status = "rented"'
		const rentals = await this.database.prepare(query).bind(userId).all()

		return rentals.results
	}
}
