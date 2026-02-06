import * as cookie from 'cookie'
import { jwtVerify, SignJWT } from 'jose'
import { jsonResponse } from 'src/helpers/json'

/**
 * @param {import('../../../../env').Env} env
 */
export async function refresh(request, env) {
	const secreteKey = new TextEncoder().encode(env.JWT_SECRET)
	const cookies = cookie.parse(request.headers.get('Cookie') || '')

	const jwt = await jwtVerify(cookies.refresh_token, secreteKey)

	const userId = jwt.payload.sub
	const userRole = jwt.payload.role

	const token = await new SignJWT({ role: userRole })
		.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
		.setSubject(userId)
		.setIssuedAt()
		.setExpirationTime('15m')
		.sign(secreteKey)

	const refresh_token = await new SignJWT({ role: userRole })
		.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
		.setSubject(userId)
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(secreteKey)

	const refreshTokenHeader = cookie.stringifySetCookie({
		name: 'refresh_token',
		value: refresh_token,
		httpOnly: true,
		path: '/',
		maxAge: 7 * 24 * 60 * 60,
		sameSite: 'strict',
		secure: false,
	})

	return new Response(JSON.stringify({ token }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Set-Cookie': refreshTokenHeader,
		},
	})
	// eslint-disable-next-line no-unreachable
	return jsonResponse({ token }, 200)
}
