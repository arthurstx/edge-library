import * as cookie from 'cookie'
import { test, expect } from 'vitest'
import { SELF } from 'cloudflare:test'
import { env } from 'src/test/env'

test('logout user integration', async () => {
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

	const response = await SELF.fetch('http://worker/auth/logout', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	const kv = await await (await env.kv_edge_library.list({ prefix: 'session:' })).keys

	const cookieHeader = response.headers.get('set-cookie')
	const cookies = cookie.parse(cookieHeader)

	expect(cookies.refresh_token).toBe('')
	expect(kv.length).toBe(0)
	expect(response.status).toBe(204)
})
