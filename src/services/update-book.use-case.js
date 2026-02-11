import { BookNotFoundError } from 'src/errors/book-not-foud-error'
/**
 * @typedef {import('../repository/d1-books-repository.js').D1BooksRepository} BooksRepository
 * @typedef {import('../types/schema.js').Book} Book
 *
 */

export class UpdateBookUseCase {
	/**
	 * @param {BooksRepository} booksRepository
	 */
	constructor(booksRepository) {
		this.booksRepository = booksRepository
	}
	/**
	 * @param {{bookId: string, data: Book }} params
	 */

	async execute({ bookId, data }) {
		const result = await this.booksRepository.update({ bookId, data })

		if (!result.meta.changed_db) {
			throw new BookNotFoundError()
		}

		return { result }
	}
}
