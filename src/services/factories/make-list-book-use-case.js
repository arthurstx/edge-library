import { CacheBooksRepository } from 'src/repository/cache/cache-books-repository.js'
import { D1BooksRepository } from 'src/repository/d1-books-repository.js'
import { ListBooksUseCase } from '../list-books.use-case.js'

export function makeListBooksUseCase(db, kv) {
	const d1BooksRepository = new D1BooksRepository(db)
	const booksRepository = new CacheBooksRepository(kv, d1BooksRepository)
	const useCase = new ListBooksUseCase(booksRepository)

	return useCase
}
