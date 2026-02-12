import { D1BooksRepository } from 'src/repository/d1-books-repository'
import { FindBookUseCase } from '../find-book.use-case'

export function makeFindBookUseCase(db) {
	const booksRepository = new D1BooksRepository(db)
	const useCase = new FindBookUseCase(booksRepository)

	return useCase
}
