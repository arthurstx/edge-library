import { BookNotFoundError } from 'src/errors/book-not-foud-error'

/**
 * @typedef {import('../repository/d1-books-repository.js').D1BooksRepository} BooksRepository
 */

export class DeleteBookUseCase {
	/**
	 * @param {BooksRepository} booksRepository
	 */
	constructor(booksRepository) {
		this.booksRepository = booksRepository
	}

	/**
	 * @param {{ bookId: string }} params
	 */
	async execute({ bookId }) {
		const book = await this.booksRepository.findById(bookId)

		if (!book) {
			throw new BookNotFoundError()
		}

		await this.booksRepository.delete(bookId)

		return {}
	}
}
