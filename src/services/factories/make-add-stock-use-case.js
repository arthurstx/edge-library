import { D1BooksRepository } from 'src/repository/d1-books-repository'
import { AddStockUseCase } from '../add-stock.use-case'

export function makeAddStockUseCase(db) {
	const booksRepository = new D1BooksRepository(db)
	const useCase = new AddStockUseCase(booksRepository)

	return useCase
}
