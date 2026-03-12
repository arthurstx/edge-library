import * as cookie from 'cookie'
import { SignJWT } from 'jose'
import z from 'zod'
import { jsonResponse } from 'src/helpers/json'
import { makeAuthenticateUseCase } from 'src/services/factories/make-authenticate-use-case'
import { InvalidCredentialsError } from 'src/errors/invalid-credentials-error'

/**
 * @param {import('../../../../env').Env} env
 * @param {Request} request
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
		const { user } = await useCase.execute({ email, password })

		const value = {
			userId: user.id,
			expirationTtl: 7 * 24 * 60 * 60, // 7 days
			createdAt: Date.now(),
		}
		console.log('env', env)
		console.log('NODE_ENV', env.NODE_ENV)
		await env.kv_edge_library.put(`session:${user.id}`, JSON.stringify(value), {
			expirationTtl: 7 * 24 * 60 * 60, // 7 days
		})

		const token = await new SignJWT({ role: user.role })
			.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
			.setSubject(user.id)
			.setJti(crypto.randomUUID())
			.setIssuedAt()
			.setExpirationTime('15m')
			.sign(secreteKey)

		const refresh_token = await new SignJWT({ role: user.role })
			.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
			.setSubject(user.id)
			.setIssuedAt()
			.setJti(crypto.randomUUID())
			.setExpirationTime('7d')
			.sign(secreteKey)

		const refreshTokenHeader = cookie.stringifySetCookie({
			name: 'refresh_token',
			value: refresh_token,
			httpOnly: true,
			path: '/',
			maxAge: 7 * 24 * 60 * 60,
			sameSite: env.NODE_ENV === 'production' ? 'none' : 'strict',
			secure: env.NODE_ENV === 'production', // Set to true in production
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
			return jsonResponse({ message: error.message }, 401)
		}
		throw error
	}
}
