import z from 'zod'
import { makeRegisterUseCase } from 'src/services/factories/make-register-use-case'
import { jsonResponse } from 'src/helpers/json'
import { UserAlreadyExistsError } from 'src/errors/user-already-exists-error'

const registerBodySchema = z.object({
	name: z.string().min(3),
	email: z.email(),
	password: z.string().min(6),
})
/**
 * @param {import('../../../../env').Env} env
 */
export async function register(request, env) {
	const body = await request.json()

	const { name, email, password } = registerBodySchema.parse(body)

	try {
		const useCase = makeRegisterUseCase(env.d1_edge_library)
		await useCase.execute(name, email, password)
		return jsonResponse({ message: 'User registered successfully' }, 201)
	} catch (error) {
		if (error instanceof UserAlreadyExistsError) {
			return jsonResponse({ message: error.message }, 400)
		}
		throw error
	}
}
