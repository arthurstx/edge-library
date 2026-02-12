import z from 'zod'
import { jsonResponse } from 'src/helpers/json'
import { BookNotFoundError } from 'src/errors/book-not-foud-error'
import { makeSearchBookUseCase } from 'src/services/factories/make-search-book-use-case'

/**
 * @param {import('../../../../env').Env} env
 */
export async function search(request, env) {
	const url = new URL(request.url)

	const getQuery = url.searchParams.get('query')
	const getPage = url.searchParams.get('page')

	const querySchema = z.object({
		query: z.string(),
		page: z.coerce.number().min(1).default(1),
	})

	const { query, page } = querySchema.parse({ query: getQuery, page: getPage })

	try {
		const useCase = makeSearchBookUseCase(env.d1_edge_library)

		const { books } = await useCase.execute({ query, page })
		return jsonResponse({ books }, 200)
	} catch (error) {
		if (error instanceof BookNotFoundError) {
			return jsonResponse({ message: error.message }, 400)
		}
		throw error
	}
}
