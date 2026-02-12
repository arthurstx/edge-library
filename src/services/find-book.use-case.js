import { BookNotFoundError } from 'src/errors/book-not-foud-error'
/**
 * @typedef {import('../repository/d1-books-repository.js').D1BooksRepository} BooksRepository
 * @typedef {import('../types/schema.js').Book} Book
 *
 */

export class FindBookUseCase {
	/**
	 * @param {BooksRepository} booksRepository
	 */
	constructor(booksRepository) {
		this.booksRepository = booksRepository
	}
	/**
	 * @param {{ bookId: string}} params
	 */
	async execute({ bookId }) {
		const book = await this.booksRepository.findById(bookId)

		if (!book) {
			throw new BookNotFoundError()
		}

		return { book }
	}
}
