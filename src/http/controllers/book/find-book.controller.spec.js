import { test, expect } from 'vitest'
import { SELF } from 'cloudflare:test'
import { registerAndAuthenticateUser } from 'src/http/test/helpers/register-and-authenticate-user'

test('find book integration', async () => {
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
	const { book } = await createBookResponse.json()

	const bookId = book.id

	const response = await SELF.fetch(`http://worker/book/find/${bookId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})

	const { book: foundBook } = await response.json()

	expect(foundBook).toEqual(
		expect.objectContaining({
			id: bookId,
			title: 'clean code',
		}),
	)
	expect(response.status).toBe(200)
})
