import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryBooksRepository } from '../repository/in-memory-repositorys/in-memory-books-repository.js'
import { BookNotFoundError } from 'src/errors/book-not-foud-error'
import { FindBookUseCase } from './find-book.use-case.js'

/**
 * @typedef {import('./find-book.use-case.js').FindBookUseCase} FindBookUseCase
 * @typedef {import('../repository/in-memory-repositorys/in-memory-books-repository.js').InMemoryBooksRepository} InMemoryBooksRepository
 */

/**@type {InMemoryBooksRepository} */
let booksRepository
/** @type {FindBookUseCase} */
let sut

describe('Find Book Use Case', () => {
	beforeEach(() => {
		booksRepository = new InMemoryBooksRepository()
		sut = new FindBookUseCase(booksRepository)
	})

	it('should be able to find by id book', async () => {
		booksRepository.create({
			id: 'book-id',
			title: 'Book Title',
			author: 'Book Author',
			category: 'Book Category',
		})

		const { book } = await sut.execute({
			bookId: 'book-id',
		})

		expect(book).toEqual(
			expect.objectContaining({
				id: 'book-id',
				title: 'Book Title',
			}),
		)
	})
	it('should not be able to find a non-existent book', async () => {
		await expect(
			sut.execute({
				bookId: 'non-existent-book-id',
			}),
		).rejects.toBeInstanceOf(BookNotFoundError)
	})
})
