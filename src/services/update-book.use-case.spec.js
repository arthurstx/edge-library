import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryBooksRepository } from '../repository/in-memory-repositorys/in-memory-books-repository.js'
import { BookNotFoundError } from 'src/errors/book-not-foud-error'
import { UpdateBookUseCase } from './update-book.use-case.js'

/**
 * @typedef {import('../services/update-book.use-case.js').UpdateBookUseCase} UpdateBookUseCase
 * @typedef {import('../repository/in-memory-repositorys/in-memory-books-repository.js').InMemoryBooksRepository} InMemoryBooksRepository
 */

/**@type {InMemoryBooksRepository} */
let booksRepository
/** @type {UpdateBookUseCase} */
let sut

describe.only('update book Use Case', () => {
	beforeEach(() => {
		booksRepository = new InMemoryBooksRepository()
		sut = new UpdateBookUseCase(booksRepository)
	})

	it('should be able to update a book', async () => {
		booksRepository.create({
			id: 'book-id',
			title: 'Book Title',
			author: 'Book Author',
			category: 'Book Category',
		})

		await sut.execute({
			bookId: 'book-id',
			data: {
				title: 'Updated Book Title',
			},
		})

		expect(booksRepository.books[0].title).toBe('Updated Book Title')
	})
	it('should not be able to update a non-existent book', async () => {
		await expect(
			sut.execute({
				data: {
					title: 'Non-existent Book Title',
				},
			}),
		).rejects.toBeInstanceOf(BookNotFoundError)
	})
})
