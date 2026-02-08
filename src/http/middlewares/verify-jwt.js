import { jwtVerify } from 'jose'
import { jsonResponse } from 'src/helpers/json'

export async function requireAuth(request, env, ctx) {
	const authHeader = request.headers.get('Authorization')

	if (!authHeader) {
		return jsonResponse({ message: 'Unauthorized' }, 401)
	}

	const [type, token] = authHeader.split(' ')

	if (type !== 'Bearer' || !token) {
		return jsonResponse({ message: 'Unauthorized' }, 401)
	}

	try {
		const secretKey = new TextEncoder().encode(env.JWT_SECRET)
		const { payload } = await jwtVerify(token, secretKey)

		const userId = payload.sub

		if (!userId) {
			return jsonResponse({ message: 'Unauthorized' }, 401)
		}

		const session = await env.kv_edge_library.get(`session:${userId}`)

		if (!session) {
			return jsonResponse({ message: 'Unauthorized' }, 401)
		}

		ctx.user = { id: userId, role: payload.role }
	} catch {
		return jsonResponse({ message: 'Unauthorized' }, 401)
	}
}
