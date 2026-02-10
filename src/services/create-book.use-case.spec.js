import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryBooksRepository } from '../repository/in-memory-repositorys/in-memory-books-repository.js'
import { CreateBookUseCase } from '../services/create-book.use-case'
import { BookAlreadyExistsError } from 'src/errors/book-already-exists-error'

/**
 * @typedef {import('../services/create-book.use-case').CreateBookUseCase} CreateBookUseCase
 * @typedef {import('../repository/in-memory-repositorys/in-memory-books-repository.js').InMemoryBooksRepository} InMemoryBooksRepository
 */

/**@type {InMemoryBooksRepository} */
let booksRepository
/** @type {CreateBookUseCase} */
let sut

describe('Create Book Use Case', () => {
	beforeEach(() => {
		booksRepository = new InMemoryBooksRepository()
		sut = new CreateBookUseCase(booksRepository)
	})

	it('should be able to create a new book', async () => {
		const { book } = await sut.execute({
			title: 'Book Title',
			author: 'Author Name',
			category: 'Category',
		})

		expect(book.id).toEqual(expect.any(String))
	})
	it('should not be able to create same book twice', async () => {
		const bookData = {
			title: 'Book Title',
			author: 'Author Name',
			category: 'Category',
		}
		await sut.execute(bookData)

		await expect(sut.execute(bookData)).rejects.toBeInstanceOf(BookAlreadyExistsError)
	})
})
