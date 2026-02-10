import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryBooksRepository } from '../repository/in-memory-repositorys/in-memory-books-repository.js'
import { AddStockUseCase } from '../services/add-stock.use-case'
import { BookNotFoundError } from 'src/errors/book-not-foud-error'

/**
 * @typedef {import('../services/add-stock.use-case.js').AddStockUseCase} AddStockUseCase
 * @typedef {import('../repository/in-memory-repositorys/in-memory-books-repository.js').InMemoryBooksRepository} InMemoryBooksRepository
 */

/**@type {InMemoryBooksRepository} */
let booksRepository
/** @type {AddStockUseCase} */
let sut

describe('Add Stock Use Case', () => {
	beforeEach(() => {
		booksRepository = new InMemoryBooksRepository()
		sut = new AddStockUseCase(booksRepository)
	})

	it('should be able to add stock to a book', async () => {
		booksRepository.create({
			id: 'book-id',
			title: 'Book Title',
			author: 'Book Author',
			category: 'Book Category',
		})

		await sut.execute({
			bookId: 'book-id',
			quantity: 10,
		})

		expect(booksRepository.books[0].total_copies).toBe(11)
	})
	it('should not be able to add stock to a non-existent book', async () => {
		await expect(
			sut.execute({
				bookId: 'non-existent-book-id',
				quantity: 10,
			}),
		).rejects.toBeInstanceOf(BookNotFoundError)
	})
})
