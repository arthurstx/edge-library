/**
 * @typedef {import('../repository/cache/cache-books-repository.js').CacheBooksRepository} BooksRepository
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
		const data = await this.booksRepository.findAll({ page })

		return { books: data.results }
	}
}
