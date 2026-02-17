/**
 * @typedef {import('../d1-books-repository').D1BooksRepository} D1BooksRepository
 * @typedef {import('../../types/schema').Book} Book
 */

/**
 * @implements {D1BooksRepository}
 */

export class InMemoryBooksRepository {
	constructor() {
		/**@type {Book[]} */
		this.books = []
	}
	/**
	 *
	 * @param {{ id?: string, title: string, author: string, category: string }} params
	 */
	async create({ id, title, author, category }) {
		const book = {
			id: id ?? crypto.randomUUID(),
			title,
			author,
			category,
			total_copies: 1,
			created_at: new Date(),
		}

		this.books.push(book)
		return { book }
	}

	async findBook(title, author) {
		const book = this.books.find((book) => book.title === title && book.author === author)
		return book ? book : null
	}

	async findById(id) {
		const book = this.books.find((book) => book.id === id)
		return book ? book : null
	}
	async addStock({ bookId, quantity }) {
		const book = await this.findById(bookId)
		if (book) {
			book.total_copies = book.total_copies + quantity
		}
	}

	async update({ bookId, data }) {
		const index = await this.books.findIndex((b) => b.id === bookId)

		if (index === -1) {
			return { meta: { changed_db: false } }
		}

		this.books[index] = {
			...this.books[index],
			...data,
		}

		return { meta: { changed_db: true } }
	}

	async search({ query = '', page = 1 }) {
		const normalizedQuery = query.toLowerCase()

		const filteredBooks = this.books.filter((book) => {
			return book.title.toLowerCase().includes(normalizedQuery) || book.author.toLowerCase().includes(normalizedQuery)
		})

		const results = filteredBooks.slice((page - 1) * 10, page * 10)

		const data = {
			results,
		}

		return data
	}

	async findAll({ page = 1 }) {
		const results = this.books.slice((page - 1) * 10, page * 10)

		const data = {
			results,
		}

		return data
	}
}
