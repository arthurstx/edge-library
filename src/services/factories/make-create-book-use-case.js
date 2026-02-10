import { D1BooksRepository } from 'src/repository/d1-books-repository'
import { CreateBookUseCase } from '../create-book.use-case'

export function makeCreateBookUseCase(db) {
	const booksRepository = new D1BooksRepository(db)
	const useCase = new CreateBookUseCase(booksRepository)

	return useCase
}
