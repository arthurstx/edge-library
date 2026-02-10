import { test, expect } from 'vitest'
import { SELF } from 'cloudflare:test'
import { env } from 'src/test/env'

test('Authentication flow (e2e)', async () => {
	const registerResponse = await SELF.fetch('http://worker/auth/register', {
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
	const token = await authenticateResponse.json().then((data) => data.token)

	const profileResponse = await SELF.fetch('http://worker/auth/me', {
		method: 'GET',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
	})

	const { user } = await profileResponse.json()
	const { userId } = JSON.parse(await env.kv_edge_library.get(`session:${user.id}`))

	const logoutResponse = await SELF.fetch('http://worker/auth/logout', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	expect(userId).toBe(user.id)
	expect(registerResponse.status).toBe(201)
	expect(profileResponse.status).toBe(200)
	expect(authenticateResponse.status).toBe(200)
	expect(logoutResponse.status).toBe(204)
})
