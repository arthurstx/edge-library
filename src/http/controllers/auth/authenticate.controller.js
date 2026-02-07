import * as cookie from 'cookie'
import { SignJWT } from 'jose'
import z from 'zod'
import { jsonResponse } from 'src/helpers/json'
import { makeAuthenticateUseCase } from 'src/services/factories/make-authenticate-use-case'
import { InvalidCredentialsError } from 'src/errors/invalid-credentials-error'

/**
 * @param {import('../../../../env').Env} env
 */
export async function authenticate(request, env) {
	const body = await request.json()

	const authenticateBodySchema = z.object({
		email: z.email(),
		password: z.string().min(6),
	})

	const secreteKey = new TextEncoder().encode(env.JWT_SECRET)

	const { email, password } = authenticateBodySchema.parse(body)

	try {
		const useCase = makeAuthenticateUseCase(env.d1_edge_library)
		const { user } = await useCase.execute(email, password)

		const token = await new SignJWT({ role: user.role })
			.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
			.setSubject(user.id)
			.setIssuedAt()
			.setExpirationTime('15m')
			.sign(secreteKey)

		const refresh_token = await new SignJWT({ role: user.role })
			.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
			.setSubject(user.id)
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
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return jsonResponse({ message: error.message }, 400)
		}
		throw error
	}
}
