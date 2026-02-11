import { test, expect } from 'vitest'
import { SELF } from 'cloudflare:test'
import { registerAndAuthenticateUser } from 'src/http/test/helpers/register-and-authenticate-user'

test('update book integration', async () => {
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

	const response = await SELF.fetch(`http://worker/book/update/${bookId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			data: {
				title: 'Updated Book Title',
			},
		}),
	})

	expect(response.status).toBe(200)
})
