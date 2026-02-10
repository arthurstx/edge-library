import { test, expect } from 'vitest'
import { SELF } from 'cloudflare:test'

test('register user integration', async () => {
	const response = await SELF.fetch('http://worker/book/create', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			title: 'clean code',
			author: 'Jane Doe',
			category: 'Fiction',
		}),
	})

	expect(response.status).toBe(201)
})
