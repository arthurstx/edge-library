import * as cookie from 'cookie'
import { test, expect } from 'vitest'
import { SELF } from 'cloudflare:test'
import { env } from 'src/test/env'

test('authenticate user integration', async () => {
	await SELF.fetch('http://worker/auth/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: 'password123',
		}),
	})

	const response = await SELF.fetch('http://worker/auth/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			email: 'johndoe@example.com',
			password: 'password123',
		}),
	})
	const { token } = await response.json()
	const kv = await (await env.kv_edge_library.list({ prefix: 'session:' })).keys[0].name

	const cookieHeader = response.headers.get('set-cookie')
	const cookies = cookie.parse(cookieHeader)

	expect(cookies.refresh_token).toEqual(expect.any(String))
	expect(kv).toEqual(expect.any(String))
	expect(token).toEqual(expect.any(String))
	expect(response.status).toBe(200)
})
