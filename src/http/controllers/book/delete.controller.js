import z from 'zod'
import { jsonResponse } from 'src/helpers/json'
import { BookNotFoundError } from 'src/errors/book-not-foud-error'
import { makeDeleteBookUseCase } from 'src/services/factories/make-delete-book-use-case'

/**
 * @param {import('../../../../env').Env} env
 */
export async function deleteBook(request, env) {
	const pathParamsSchema = z.object({
		id: z.string().uuid(),
	})

	const { id: bookId } = pathParamsSchema.parse(request.params)

	try {
		const useCase = makeDeleteBookUseCase(env.d1_edge_library)

		await useCase.execute({ bookId })
		
		return new Response(null, { status: 204 })
	} catch (error) {
		if (error instanceof BookNotFoundError) {
			return jsonResponse({ message: error.message }, 404)
		}
		throw error
	}
}
