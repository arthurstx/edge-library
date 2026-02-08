import * as cookie from 'cookie'

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
 */
export async function logout(_request, env, ctx) {
	await env.kv_edge_library.delete(`session:${ctx.user.id}`)

	const refreshTokenHeader = cookie.serialize('refresh_token', '', {
		httpOnly: true,
		path: '/',
		maxAge: 0,
		sameSite: 'strict',
		secure: false,
	})

	return new Response(null, {
		status: 204,
		headers: {
			'Content-Type': 'application/json',
			'Set-Cookie': refreshTokenHeader,
		},
	})
}
