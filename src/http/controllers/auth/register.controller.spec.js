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

	const { userJson } = await response.json()

	expect(userJson.id).toEqual(expect.any(String))
	expect(response.status).toBe(201)
})
