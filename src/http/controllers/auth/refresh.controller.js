import * as cookie from 'cookie'
import { jwtVerify, SignJWT } from 'jose'
import { jsonResponse } from 'src/helpers/json'

/**
 * @param {Request} request
 * @param {import('../../../../env').Env} env
 */
export async function refresh(request, env) {
	const cookieHeader = request.headers.get('cookie')
	const cookies = cookie.parse(cookieHeader || '')
	const oldRefreshToken = cookies.refresh_token

	if (!oldRefreshToken) {
		return jsonResponse({ message: 'Unauthorized: Missing refresh token' }, 401)
	}

	const secretKey = new TextEncoder().encode(env.JWT_SECRET)

	try {
		const { payload } = await jwtVerify(oldRefreshToken, secretKey)

		if (!payload.jti || !payload.sub) {
			return jsonResponse({ message: 'Invalid token payload' }, 401)
		}

		const [isRevoked, sessionData] = await Promise.all([
			env.kv_edge_library.get(`jwt:blacklist:${payload.jti}`),
			env.kv_edge_library.get(`session:${payload.sub}`),
		])

		if (isRevoked) {
			return jsonResponse({ message: 'Token revoked' }, 401)
		}

		if (!sessionData) {
			return jsonResponse({ message: 'Session expired or invalid' }, 401)
		}

		const now = Math.floor(Date.now() / 1000)
		const ttl = payload.exp - now

		if (ttl > 0) {
			await env.kv_edge_library.put(`jwt:blacklist:${payload.jti}`, 'true', {
				expirationTtl: Math.max(ttl, 60),
			})
		}

		const userId = payload.sub
		const userRole = payload.role

		const [accessToken, newRefreshToken] = await Promise.all([
			new SignJWT({ role: userRole })
				.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
				.setSubject(userId)
				.setJti(crypto.randomUUID())
				.setIssuedAt()
				.setExpirationTime('15m')
				.sign(secretKey),

			new SignJWT({ role: userRole })
				.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
				.setSubject(userId)
				.setJti(crypto.randomUUID())
				.setIssuedAt()
				.setExpirationTime('7d')
				.sign(secretKey),
		])

		const refreshTokenCookie = cookie.stringifySetCookie({
			name: 'refresh_token',
			value: newRefreshToken,
			httpOnly: true,
			path: '/',
			maxAge: 7 * 24 * 60 * 60,
			sameSite: env.NODE_ENV === 'production' ? 'none' : 'strict',
			secure: env.NODE_ENV === 'production', // Set to true in production
		})

		return new Response(JSON.stringify({ token: accessToken }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Set-Cookie': refreshTokenCookie,
			},
		})
	} catch (error) {
		const message = error.code === 'ERR_JWT_EXPIRED' ? 'Refresh token expired' : 'Unauthorized'
		return jsonResponse({ message }, 401)
	}
}
