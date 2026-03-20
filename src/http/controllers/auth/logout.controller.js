import * as cookie from 'cookie'
import { jwtVerify } from 'jose'
import { jsonResponse } from 'src/helpers/json'

/**
 * @typedef {Object} user
 * @property {string} id
 * @property {string} role
 *
 */

/**
 * @typedef {Object} Context
 * @property {user} user
 */

/**
 * @param {import('../../../../env').Env} env
 * @param {Context} ctx
 * @param {Request} request
 */
export async function logout(request, env, ctx) {
	if (!ctx.user || !ctx.user.id) {
		return jsonResponse({ message: 'Unauthorized' }, 401)
	}

	const cookieHeader = request.headers.get('cookie')
	const cookies = cookie.parse(cookieHeader || '')
	const refresh_token = cookies.refresh_token
	const secretKey = new TextEncoder().encode(env.JWT_SECRET)

	const tasks = [env.kv_edge_library.delete(`session:${ctx.user.id}`)]

	if (refresh_token) {
		try {
			const { payload } = await jwtVerify(refresh_token, secretKey)
			const ttl = payload.exp - Math.floor(Date.now() / 1000)

			if (payload.jti && ttl > 0) {
				tasks.push(
					env.kv_edge_library.put(`jwt:blacklist:${payload.jti}`, 'true', {
						expirationTtl: ttl,
					}),
				)
			}
		} catch {
			console.error('Refresh token invalid during logout, skipping blacklist.')
		}
	}

	await Promise.all(tasks)

	const refreshTokenHeader = cookie.serialize('refresh_token', '', {
		httpOnly: true,
		path: '/',
		maxAge: 0,
		sameSite: env.NODE_ENV === 'production' ? 'none' : 'strict',
		secure: env.NODE_ENV === 'production', // Set to true in production
	})

	return new Response(null, {
		status: 204,
		headers: {
			'Set-Cookie': refreshTokenHeader,
		},
	})
}
