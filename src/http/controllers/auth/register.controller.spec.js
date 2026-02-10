import { test, expect } from 'vitest'
import { SELF } from 'cloudflare:test'

test('register user integration', async () => {
	const response = await SELF.fetch('http://worker/auth/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: 'password123',
		}),
	})

	expect(response.status).toBe(201)
})
