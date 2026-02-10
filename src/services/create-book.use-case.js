import { BookAlreadyExistsError } from 'src/errors/book-already-exists-error'
/**
 * @typedef {import('../repository/d1-books-repository.js').D1BooksRepository} BooksRepository
 * @typedef {import('../types/schema.js').Book} Book
 *
 */

export class CreateBookUseCase {
	/**
	 * @param {BooksRepository} booksRepository
	 */
	constructor(booksRepository) {
		this.booksRepository = booksRepository
	}
	/**
	 * @param {{ title: string, author: string, category: string }} params
	 * @returns {Promise<{ book: Book }>}
	 */
	async execute({ title, author, category }) {
		const data = {
			title,
			author,
			category,
		}

		const bookExists = await this.booksRepository.findBook(title, author)

		if (bookExists) {
			throw new BookAlreadyExistsError()
		}

		const book = await this.booksRepository.create(data)
		return { book }
	}
}
