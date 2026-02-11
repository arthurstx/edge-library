import { D1BooksRepository } from 'src/repository/d1-books-repository'
import { UpdateBookUseCase } from '../update-book.use-case'

export function makeUpdateBookUseCase(db) {
	const booksRepository = new D1BooksRepository(db)
	const useCase = new UpdateBookUseCase(booksRepository)

	return useCase
}
