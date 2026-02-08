import { jwtVerify } from 'jose'
import { jsonResponse } from 'src/helpers/json'

/**
 * @param {import('../../../../env').Env} env
 * @param {Request} request
 * @param {any} ctx
 */
export async function requireAuth(request, env, ctx) {
	const authHeader = request.headers.get('Authorization')

	if (!authHeader) {
		return jsonResponse({ message: 'Unauthorized: Missing token' }, 401)
	}

	const [type, token] = authHeader.split(' ')

	if (type !== 'Bearer' || !token) {
		return jsonResponse({ message: 'Unauthorized: Invalid format' }, 401)
	}

	try {
		const secretKey = new TextEncoder().encode(env.JWT_SECRET)

		const { payload } = await jwtVerify(token, secretKey)
		const userId = payload.sub

		if (!userId) {
			return jsonResponse({ message: 'Unauthorized: Invalid payload' }, 401)
		}

		if (payload.jti) {
			const isRevoked = await env.kv_edge_library.get(`jwt:blacklist:${payload.jti}`)
			if (isRevoked) {
				return jsonResponse({ message: 'Token revoked' }, 401)
			}
		}

		const session = await env.kv_edge_library.get(`session:${userId}`)
		if (!session) {
			return jsonResponse({ message: 'Session expired or logout performed' }, 401)
		}

		ctx.user = {
			id: userId,
			role: payload.role,
		}
	} catch (error) {
		if (error.code === 'ERR_JWT_EXPIRED') {
			return jsonResponse({ message: 'Token expired' }, 401)
		}
		return jsonResponse({ message: 'Unauthorized' }, 401)
	}
}
