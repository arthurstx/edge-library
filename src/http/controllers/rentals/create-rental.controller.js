import z from 'zod'
import { jsonResponse } from 'src/helpers/json'
import { BookNotFoundError } from 'src/errors/book-not-foud-error'
import { makeCreateRentalsUseCase } from 'src/services/factories/make-create-rentals-use-case'
import { UserNotFoundError } from 'src/errors/user-not-found-error'
import { OutOfStockError } from 'src/errors/out-of-stock-error'

/**
 * @param {import('../../../../env').Env} env
 */
export async function create(request, env) {
	const body = await request.json()

	const CreateRentalBodySchema = z.object({
		userId: z.uuid(),
		bookId: z.uuid(),
	})

	const { userId, bookId } = CreateRentalBodySchema.parse(body)

	try {
		const useCase = makeCreateRentalsUseCase(env.d1_edge_library)

		const { rental } = await useCase.execute({ bookId, userId })
		return jsonResponse({ message: 'Rental created successfully', rental }, 201)
	} catch (error) {
		if (error instanceof UserNotFoundError) {
			return jsonResponse({ message: error.message }, 404)
		}
		if (error instanceof OutOfStockError) {
			return jsonResponse({ message: error.message }, 409)
		}
		if (error instanceof BookNotFoundError) {
			return jsonResponse({ message: error.message }, 404)
		}
		throw error
	}
}
