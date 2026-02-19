import { test, expect } from 'vitest'
import { SELF } from 'cloudflare:test'
import { registerAndAuthenticateUser } from 'src/http/test/helpers/register-and-authenticate-user'

test('register user integration', async () => {
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

	const { userJson: user } = await createUserResponse.json()
	const { book } = await createBookResponse.json()

	const response = await SELF.fetch('http://worker/rental', {
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
	expect(rental).toEqual(
		expect.objectContaining({
			id: expect.any(String),
			bookId: book.id,
			userId: user.id,
		}),
	)

	expect(response.status).toBe(201)
})
