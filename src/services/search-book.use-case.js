/**
 * @typedef {import('../repository/d1-books-repository.js').D1BooksRepository} BooksRepository
 * @typedef {import('../types/schema.js').Book} Book
 *
 */

export class SearchBookUseCase {
	/**
	 * @param {BooksRepository} booksRepository
	 */
	constructor(booksRepository) {
		this.booksRepository = booksRepository
	}
	/**
	 * @param {{ query: string, page : number}} params
	 */
	async execute({ query, page }) {
		const data = await this.booksRepository.search({ query, page })

		return { books: data.results }
	}
}
