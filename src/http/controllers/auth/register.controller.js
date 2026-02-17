import z from 'zod'
import { makeRegisterUseCase } from 'src/services/factories/make-register-use-case'
import { jsonResponse } from 'src/helpers/json'
import { UserAlreadyExistsError } from 'src/errors/user-already-exists-error'

/**
 * @param {import('../../../../env').Env} env
 */
export async function register(request, env) {
	const body = await request.json()
	const registerBodySchema = z.object({
		name: z.string().min(3),
		email: z.email(),
		password: z.string().min(6),
		role: z.enum(['user', 'admin']).optional(),
	})

	const { name, email, password, role } = registerBodySchema.parse(body)

	try {
		const useCase = makeRegisterUseCase(env.d1_edge_library)
		const { user } = await useCase.execute({ name, email, password, role })

		const userJson = {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			createdAt: user.createdAt,
		}
		return jsonResponse({ message: 'User registered successfully', userJson }, 201)
	} catch (error) {
		if (error instanceof UserAlreadyExistsError) {
			return jsonResponse({ message: error.message }, 409)
		}
		throw error
	}
}
