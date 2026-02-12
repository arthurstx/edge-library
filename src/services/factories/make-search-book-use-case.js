import { D1BooksRepository } from 'src/repository/d1-books-repository'
import { SearchBookUseCase } from '../search-book.use-case'

export function makeSearchBookUseCase(db) {
	const booksRepository = new D1BooksRepository(db)
	const useCase = new SearchBookUseCase(booksRepository)

	return useCase
}
