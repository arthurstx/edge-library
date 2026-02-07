import * as cookie from 'cookie'

/**
 * @param {import('../../../../env').Env} env
 */
export async function logout(_request, _env) {
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
