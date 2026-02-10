import { BookNotFoundError } from 'src/errors/book-not-foud-error'
/**
 * @typedef {import('../repository/d1-books-repository.js').D1BooksRepository} BooksRepository
 * @typedef {import('../types/schema.js').Book} Book
 *
 */

export class AddStockUseCase {
	/**
	 * @param {BooksRepository} booksRepository
	 */
	constructor(booksRepository) {
		this.booksRepository = booksRepository
	}
	/**
	 * @param {{ bookId: string, quantity: number }} params
	 */
	async execute({ bookId, quantity }) {
		const book = await this.booksRepository.findById(bookId)

		if (!book) {
			throw new BookNotFoundError()
		}

		await this.booksRepository.addStock({ bookId, quantity })
	}
}
