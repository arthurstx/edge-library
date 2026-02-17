/**
 * @typedef {import('../d1-books-repository.js').D1BooksRepository} D1BooksRepository
 */

export class CacheBooksRepository {
	/**
	 *
	 * @param {KVNamespace} kv
	 * @param {D1BooksRepository} d1
	 */

	constructor(kv, d1) {
		this.kv = kv
		this.d1 = d1
	}

	/**
	 *
	 * @param {{page:number}} params
	 * @return {Promise<{results:Book[]}>}
	 */
	async findAll({ page = 1 }) {
		const cacheKey = `books:list:page:${page}`

		const cached = await this.kv.get(cacheKey)

		if (cached) {
			return JSON.parse(cached)
		}

		const books = await this.d1.findAll({ page })
		await this.kv.put(cacheKey, JSON.stringify(books), { expirationTtl: 60 }) // Cache for 60 seconds
		return books
	}
}
