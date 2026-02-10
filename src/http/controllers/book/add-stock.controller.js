import z from 'zod'
import { jsonResponse } from 'src/helpers/json'
import { makeAddStockUseCase } from 'src/services/factories/make-add-stock-use-case'
import { BookNotFoundError } from 'src/errors/book-not-foud-error'

/**
 * @param {import('../../../../env').Env} env
 */
export async function addStock(request, env) {
	const body = await request.json()

	const pathParamsSchema = z.object({
		id: z.uuid(),
	})

	const addStockBodySchema = z.object({
		quantity: z.number().positive(),
	})

	const { id: bookId } = pathParamsSchema.parse(request.params)

	const { quantity } = addStockBodySchema.parse(body)

	try {
		const useCase = makeAddStockUseCase(env.d1_edge_library)

		await useCase.execute({ bookId, quantity })
		return jsonResponse({ message: 'Stock added successfully' }, 201)
	} catch (error) {
		if (error instanceof BookNotFoundError) {
			return jsonResponse({ message: error.message }, 400)
		}
		throw error
	}
}
