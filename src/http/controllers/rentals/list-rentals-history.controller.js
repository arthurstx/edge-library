import { jsonResponse } from 'src/helpers/json'
import { makeListRentalsHistoryUseCase } from 'src/services/factories/make-list-rentals-history-use-case'
import z from 'zod'

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
export async function history(request, env, ctx) {
	const url = new URL(request.url)
	const userId = ctx.user.id

	const listRentalsHistoryQuerySchema = z.object({
		page: z.coerce.number().min(1).default(1),
	})

	try {
		const { page } = listRentalsHistoryQuerySchema.parse(url.searchParams)

		const useCase = makeListRentalsHistoryUseCase(env.d1_edge_library)

		const { rental } = await useCase.execute({ userId, page })
		return jsonResponse({ message: 'Rental list successfully', rental }, 200)
	} catch (error) {
		console.error(error)
		throw error
	}
}
