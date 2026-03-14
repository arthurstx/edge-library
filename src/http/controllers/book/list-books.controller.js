import z from 'zod'
import { jsonResponse } from 'src/helpers/json'
import { BookNotFoundError } from 'src/errors/book-not-foud-error'
import { makeListBooksUseCase } from 'src/services/factories/make-list-book-use-case'

/**
 * @param {import('../../../../env').Env} env
 */
export async function list(request, env) {
	const url = new URL(request.url)

	const getPage = url.searchParams.get('page') ?? undefined
	const querySchema = z.object({
		page: z.coerce.number().min(1).default(1),
	})

	const { page } = querySchema.parse({ page: getPage })

	try {
		const useCase = makeListBooksUseCase(env.d1_edge_library, env.kv_edge_library)

		const { books } = await useCase.execute({ page })
		return jsonResponse({ books }, 200)
	} catch (error) {
		if (error instanceof BookNotFoundError) {
			return jsonResponse({ message: error.message }, 404)
		}
		throw error
	}
}
