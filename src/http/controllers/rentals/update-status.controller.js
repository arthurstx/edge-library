import { RentalNotFoundError } from 'src/errors/rental-not-found-error'
import { jsonResponse } from 'src/helpers/json'
import { makeUpdateRentalStatusUseCase } from 'src/services/make-update-rentals-use-case'
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
export async function updateStatus(request, env) {
	const body = await request.json()

	const updateStatusBodySchema = z.object({
		userId: z.string(),
	})

	const updateStatusQuerySchema = z.object({
		id: z.string(),
	})

	const { userId } = updateStatusBodySchema.parse(body)
	const { id } = updateStatusQuerySchema.parse(request.params)

	try {
		const useCase = makeUpdateRentalStatusUseCase(env.d1_edge_library)

		await useCase.execute({ userId, id })
		return jsonResponse({ message: 'Rental status updated successfully' }, 200)
	} catch (error) {
		if (error instanceof RentalNotFoundError) {
			return jsonResponse({ message: error.message }, 404)
		}
		throw error
	}
}
