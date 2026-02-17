import { jsonResponse } from 'src/helpers/json'
import { makeProfileUseCase } from 'src/services/factories/make-profile-use-case'
import { ResourceNotFoundError } from 'src/errors/resource-not-found-error'

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
export async function profile(request, env, ctx) {
	const { id } = ctx.user

	try {
		const useCase = makeProfileUseCase(env.d1_edge_library)
		const { user } = await useCase.execute(id)
		return jsonResponse({ user }, 200)
	} catch (error) {
		if (error instanceof ResourceNotFoundError) {
			return jsonResponse({ message: error.message }, 404)
		}
		throw error
	}
}
