import { jsonResponse } from 'src/helpers/json'
import { makeListAllRentalsUseCase } from 'src/services/factories/make-list-all-rentals-use-case'
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
export async function listAll(request, env, ctx) {
	const url = new URL(request.url)

	const listAllRentalsQuerySchema = z.object({
		page: z.coerce.number().min(1).default(1),
		query: z.string().optional(),
	})

	try {
		const { page, query } = listAllRentalsQuerySchema.parse(Object.fromEntries(url.searchParams))

		const useCase = makeListAllRentalsUseCase(env.d1_edge_library)

		const { rentals } = await useCase.execute({ query, page })
		return jsonResponse({ message: 'Rental list successfully', rentals }, 200)
	} catch (error) {
		console.error(error)
		throw error
	}
}
