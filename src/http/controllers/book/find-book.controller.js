import z from 'zod'
import { jsonResponse } from 'src/helpers/json'
import { BookNotFoundError } from 'src/errors/book-not-foud-error'
import { makeFindBookUseCase } from 'src/services/factories/make-find-book.use-case'

/**
 * @param {import('../../../../env').Env} env
 */
export async function findBook(request, env) {
	const pathParamsSchema = z.object({
		id: z.uuid(),
	})

	const { id: bookId } = pathParamsSchema.parse(request.params)

	try {
		const useCase = makeFindBookUseCase(env.d1_edge_library)

		const { book } = await useCase.execute({ bookId })
		return jsonResponse({ book }, 200)
	} catch (error) {
		if (error instanceof BookNotFoundError) {
			return jsonResponse({ message: error.message }, 400)
		}
		throw error
	}
}
