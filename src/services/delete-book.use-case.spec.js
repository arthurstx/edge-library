import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryBooksRepository } from 'src/repository/in-memory-repositorys/in-memory-books-repository.js'
import { DeleteBookUseCase } from './delete-book.use-case.js'
import { BookNotFoundError } from 'src/errors/book-not-foud-error'

/**
 * @typedef {import('../repository/in-memory-repositorys/in-memory-books-repository.js').InMemoryBooksRepository} InMemoryBooksRepository
 */

/**@type {InMemoryBooksRepository} */
let booksRepository
/** @type {DeleteBookUseCase} */
let sut

describe('delete book Use Case', () => {
	beforeEach(() => {
		booksRepository = new InMemoryBooksRepository()
		sut = new DeleteBookUseCase(booksRepository)
	})

	it('should be able to delete a book', async () => {
		const { book } = await booksRepository.create({
			title: 'A Great Book',
			author: 'John Doe',
			category: 'Fiction',
		})

		await sut.execute({ bookId: book.id })

		const foundBook = await booksRepository.findById(book.id)
		expect(foundBook).toBeNull()
	})

	it('should not be able to delete a non-existing book', async () => {
		await expect(() => sut.execute({ bookId: 'non-existing-id' })).rejects.toBeInstanceOf(BookNotFoundError)
	})
})
