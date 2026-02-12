import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryBooksRepository } from '../repository/in-memory-repositorys/in-memory-books-repository.js'
import { SearchBookUseCase } from './search-book.use-case.js'

let booksRepository
let sut

describe('Search Book Use Case', () => {
	beforeEach(() => {
		booksRepository = new InMemoryBooksRepository()
		sut = new SearchBookUseCase(booksRepository)
	})

	it('should be able to search for books by query', async () => {
		await booksRepository.create({
			id: 'book-id',
			title: 'Book Title',
			author: 'Book Author',
			category: 'Book Category',
		})

		await booksRepository.create({
			id: 'book-id-2',
			title: 'Book Title 2',
			author: 'Book Author 2',
			category: 'Book Category 2',
		})

		const result = await sut.execute({
			query: 'Book Title',
			page: 1,
		})

		expect(result.books).toHaveLength(2)
		expect(result.books).toEqual(
			expect.arrayContaining([expect.objectContaining({ id: 'book-id' }), expect.objectContaining({ id: 'book-id-2' })]),
		)
	})

	it('should return an empty array if no books match the search query', async () => {
		const result = await sut.execute({
			query: 'Non-existent Book',
			page: 1,
		})

		expect(result.books).toEqual([])
	})

	it('should return paginated books (10 per page)', async () => {
		for (let i = 1; i <= 12; i++) {
			await booksRepository.create({
				id: `book-${i}`,
				title: `JavaScript Book ${i}`,
				author: 'Author',
				category: 'Tech',
			})
		}

		const result = await sut.execute({
			query: 'JavaScript',
			page: 2,
		})

		expect(result.books).toHaveLength(2)
		expect(result.books[0].id).toBe('book-11')
		expect(result.books[1].id).toBe('book-12')
	})
})
