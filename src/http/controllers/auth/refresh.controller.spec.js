import * as cookie from 'cookie'
import { test, expect } from 'vitest'
import { SELF } from 'cloudflare:test'

test('refresh token integration', async () => {
	await SELF.fetch('http://worker/auth/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: 'password123',
		}),
	})

	const authResponse = await SELF.fetch('http://worker/auth/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			email: 'johndoe@example.com',
			password: 'password123',
		}),
	})
	const authenticateCookieHeader = authResponse.headers.get('set-cookie')
	const authenticateCookies = cookie.parse(authenticateCookieHeader)

	const response = await SELF.fetch('http://worker/auth/refresh', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Cookie: `refresh_token=${authenticateCookies.refresh_token}`, // Replace with actual token if needed
		},
	})
	const cookieHeader = response.headers.get('set-cookie')
	const cookies = cookie.parse(cookieHeader)

	const { token } = await response.json()

	expect(token).toEqual(expect.any(String))
	expect(cookies.refresh_token).toEqual(expect.any(String))
	expect(response.status).toBe(200)
})
