import { test, expect } from 'vitest'
import { SELF } from 'cloudflare:test'
import { registerAndAuthenticateUser } from 'src/http/test/helpers/register-and-authenticate-user'
import { env } from 'cloudflare:workers'

test('list book integration', async () => {
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

	const response = await SELF.fetch('http://worker/book/list?page=1', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
	const { books } = await response.json()

	const { results } = await JSON.parse(await env.kv_edge_library.get('books:list:page:1'))

	expect(books).toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				id: bookId,
				title: 'clean code',
			}),
		]),
	)
	expect(results).toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				id: bookId,
				title: 'clean code',
			}),
		]),
	)
	expect(response.status).toBe(200)
})
