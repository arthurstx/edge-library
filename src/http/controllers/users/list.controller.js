import z from 'zod'
import { jsonResponse } from 'src/helpers/json'
import { makeListUsersUseCase } from 'src/services/factories/make-list-users-use-case'

/**
 * @param {import('../../../../env').Env} env
 */
export async function list(request, env) {
	const searchParams = new URL(request.url).searchParams
	const querySchema = z.object({
		query: z.string().optional(),
		page: z.coerce.number().min(1).default(1),
	})

	const { query, page } = querySchema.parse(Object.fromEntries(searchParams))

	try {
		const useCase = makeListUsersUseCase(env.d1_edge_library)
		const { users } = await useCase.execute({ query, page })

		return jsonResponse({ users }, 200)
	} catch (error) {
		console.error(error)
		throw error
	}
}
