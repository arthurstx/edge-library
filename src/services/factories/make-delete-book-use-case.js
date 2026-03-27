import { D1BooksRepository } from 'src/repository/d1-books-repository.js'
import { DeleteBookUseCase } from 'src/services/delete-book.use-case.js'

export function makeDeleteBookUseCase(db) {
	const booksRepository = new D1BooksRepository(db)
	return new DeleteBookUseCase(booksRepository)
}
