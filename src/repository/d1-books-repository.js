export class D1BooksRepository {
	/**
	 * @param {D1Database} database
	 */
	constructor(database) {
		this.database = database
	}

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

	async findBook(title, author) {
		const result = await this.database.prepare('SELECT * FROM books WHERE title = ? AND author = ?').bind(title, author).first()
		return result ? result : null
	}

	async findById(id) {
		const result = await this.database.prepare('SELECT * FROM books WHERE id = ?').bind(id).first()
		return result ? result : null
	}

	async addStock({ bookId, quantity }) {
		await this.database.prepare('UPDATE books SET total_copies = total_copies + ? WHERE id = ?').bind(quantity, bookId).run()
	}
}
