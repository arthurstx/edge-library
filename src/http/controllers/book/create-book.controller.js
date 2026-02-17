import z from 'zod'
import { jsonResponse } from 'src/helpers/json'
import { makeCreateBookUseCase } from 'src/services/factories/make-create-book-use-case'
import { BookAlreadyExistsError } from 'src/errors/book-already-exists-error'

/**
 * @param {import('../../../../env').Env} env
 */
export async function create(request, env) {
	const body = await request.json()
	const createBookBodySchema = z.object({
		title: z.string().min(2),
		author: z.string().min(2),
		category: z.string().min(2),
	})

	const { title, author, category } = createBookBodySchema.parse(body)

	try {
		const useCase = makeCreateBookUseCase(env.d1_edge_library)

		const { book } = await useCase.execute({ title, author, category })
		return jsonResponse({ message: 'Book created successfully', book }, 201)
	} catch (error) {
		if (error instanceof BookAlreadyExistsError) {
			return jsonResponse({ message: error.message }, 409)
		}
		throw error
	}
}
