/**
 * @typedef {import('../repository/d1-books-repository.js').D1BooksRepository} BooksRepository
 * @typedef {import('../types/schema.js').Book} Book
 *
 */

export class ListBooksUseCase {
	/**
	 * @param {BooksRepository} booksRepository
	 */
	constructor(booksRepository) {
		this.booksRepository = booksRepository
	}
	/**
	 * @param {{ page : number}} params
	 */
	async execute({ page }) {
		const data = await this.booksRepository.list({ page })

		return { books: data.results }
	}
}
