import { D1BooksRepository } from 'src/repository/d1-books-repository'
import { ListBooksUseCase } from '../list-books.use-case'

export function makeListBooksUseCase(db) {
	const booksRepository = new D1BooksRepository(db)
	const useCase = new ListBooksUseCase(booksRepository)

	return useCase
}
