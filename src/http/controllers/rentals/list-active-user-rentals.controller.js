import { jsonResponse } from 'src/helpers/json'
import { makeListActiveUserRentalsUseCase } from 'src/services/factories/make-list-active-user-rantals-use-case'

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
export async function list(request, env, ctx) {
	const userId = ctx.user.id

	try {
		const useCase = makeListActiveUserRentalsUseCase(env.d1_edge_library)

		const { rentals } = await useCase.execute({ userId })

		return jsonResponse({ message: 'Rental list successfully', rentals }, 200)
	} catch (error) {
		console.error(error)
		throw error
	}
}
