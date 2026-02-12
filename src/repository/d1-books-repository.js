/**
 * @typedef {import('../types/schema.d.ts').Book} Book
 */

export class D1BooksRepository {
	/**
	 * @param {D1Database} database
	 */
	constructor(database) {
		/** @type {D1Database} */
		this.database = database
	}

	/**
	 * @param {Book} book
	 * @returns {Promise<{ book: Book }>}
	 */
	async create(book) {
		const { title, author, category } = book
		const id = crypto.randomUUID()
		const created_at = new Date().toISOString()

		await this.database
			.prepare('INSERT INTO books (id, title, author, category, created_at, total_copies) VALUES (?, ?, ?, ?, ?, 1)')
			.bind(id, title, author, category, created_at)
			.run()

		return {
			book: {
				id,
				title,
				author,
				category,
				created_at,
				total_copies: 1,
			},
		}
	}

	/**
	 * @param {string} title
	 * @param {string} author
	 * @returns {Promise<Book | null>}
	 */
	async findBook(title, author) {
		const result = await this.database.prepare('SELECT * FROM books WHERE title = ? AND author = ?').bind(title, author).first()

		return result ? result : null
	}

	/**
	 * @param {string} id
	 * @returns {Promise<Book | null>}
	 */
	async findById(id) {
		const result = await this.database.prepare('SELECT * FROM books WHERE id = ?').bind(id).first()

		return result ? result : null
	}

	/**
	 * @param {{ bookId: string, quantity: number }} params
	 * @returns {Promise<D1Result>}
	 */
	async addStock({ bookId, quantity }) {
		return await this.database.prepare('UPDATE books SET total_copies = total_copies + ? WHERE id = ?').bind(quantity, bookId).run()
	}

	/**
	 * @param {{ bookId: string, data: Partial<Book> }} params
	 * @returns {Promise<D1Result>}
	 */
	async update({ bookId, data }) {
		const { title = null, author = null, category = null } = data

		const query = `
			UPDATE books 
			SET 
				title = COALESCE(?, title), 
				author = COALESCE(?, author), 
				category = COALESCE(?, category) 
			WHERE id = ?
		`

		return await this.database.prepare(query).bind(title, author, category, bookId).run()
	}

	async search({ query, page }) {
		const sqlQuery = `
			SELECT * FROM books
			WHERE title LIKE '%' || ? || '%' OR author LIKE '%' || ? || '%'
			LIMIT 10 OFFSET ?
		`
		return await this.database
			.prepare(sqlQuery)
			.bind(query, query, (page - 1) * 10)
			.all()
	}
}
