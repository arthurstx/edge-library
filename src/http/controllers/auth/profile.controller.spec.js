import { test, expect } from 'vitest'
import { SELF } from 'cloudflare:test'

test('get profile user integration', async () => {
	await SELF.fetch('http://worker/auth/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: 'password123',
		}),
	})

	const authenticateResponse = await SELF.fetch('http://worker/auth/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			email: 'johndoe@example.com',
			password: 'password123',
		}),
	})
	const { token } = await authenticateResponse.json()

	const response = await SELF.fetch('http://worker/auth/me', {
		method: 'GET',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
	})

	const { user } = await response.json()

	expect(user).toEqual(
		expect.objectContaining({
			name: 'John Doe',
			email: 'johndoe@example.com',
		}),
	)
	expect(response.status).toBe(200)
})
