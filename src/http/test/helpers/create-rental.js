import { SELF } from 'cloudflare:test'
import { registerAndAuthenticateUser } from './register-and-authenticate-user'

/**
 * @typedef {import('../../../types/schema').Rental} Rental
 * @typedef {import('../../../types/schema').User} User
 */

/**
 *
 * @returns {Promise<{ rental: Rental, token: string, user: User }>}
 */
export async function createRental() {
	const token = await registerAndAuthenticateUser('admin')

	const createBookResponse = await SELF.fetch('http://worker/book/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			title: 'clean code',
			author: 'Jane Doe',
			category: 'Fiction',
		}),
	})

	const createUserResponse = await SELF.fetch('http://worker/auth/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			name: 'John Doe',
			email: 'newUser@example.com',
			password: 'password123',
		}),
	})

	const authenticateResponse = await SELF.fetch('http://worker/auth/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			email: 'newUser@example.com',
			password: 'password123',
		}),
	})
	const { token: userToken } = await authenticateResponse.json()

	const { userJson: user } = await createUserResponse.json()
	const { book } = await createBookResponse.json()

	const response = await SELF.fetch('http://worker/rental/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			bookId: book.id,
			userId: user.id,
		}),
	})

	const { rental } = await response.json()
	return { rental, user, token: userToken }
}
