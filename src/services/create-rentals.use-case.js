import { BookNotFoundError } from 'src/errors/book-not-foud-error'
import { OutOfStockError } from 'src/errors/out-of-stock-error.js'
import { UserNotFoundError } from 'src/errors/user-not-found-error.js'
/**
 * @typedef {import('../repository/d1-books-repository.js').D1BooksRepository} BooksRepository
 * @typedef {import('../repository/d1-users-repository.js').D1UsersRepository} UserRepository
 * @typedef {import('../repository/d1-rentals-repository.js').D1RentalsRepository} RentalsRepository
 * @typedef {import('../types/schema.js').Rental} Rental
 *
 */

export class CreateRentalUseCase {
	/**
	 * @param {BooksRepository} booksRepository
	 * @param {UserRepository} userRepository
	 * @param {RentalsRepository} rentalsRepository
	 * @param {D1Database} d1
	 */
	constructor(d1, booksRepository, userRepository, rentalsRepository) {
		this.d1 = d1
		this.booksRepository = booksRepository
		this.userRepository = userRepository
		this.rentalsRepository = rentalsRepository
	}
	/**
	 * @param {{ bookId: string, userId: string }} params
	 */
	async execute({ bookId, userId }) {
		console.log('======== USE CASE =========')

		const [user, book] = await Promise.all([this.userRepository.findById(userId), this.booksRepository.findById(bookId)])

		if (!user) throw new UserNotFoundError()
		if (!book) throw new BookNotFoundError()

		if (book.quantity <= 0) {
			throw new OutOfStockError()
		}

		const startDate = new Date().toISOString()
		const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days later

		const rental = {
			id: crypto.randomUUID(),
			userId,
			bookId,
			status: 'rented',
			startDate,
			endDate,
		}

		const statements = [
			this.booksRepository.decreasePreparedStatement({ bookId, quantity: 1 }),
			this.rentalsRepository.createPreparedStatement({ ...rental }),
		]

		const results = await this.d1.batch(statements)
		console.log('========= use case ==========')
		console.log(rental)

		if (!results[0].meta.changed_db) {
			throw new OutOfStockError()
		}

		return {
			rental,
		}
	}
}
