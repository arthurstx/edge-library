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
		return book
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
}
