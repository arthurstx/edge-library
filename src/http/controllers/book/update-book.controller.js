import z from 'zod'
import { jsonResponse } from 'src/helpers/json'
import { BookNotFoundError } from 'src/errors/book-not-foud-error'
import { makeUpdateBookUseCase } from 'src/services/factories/make-update-book-use-case'

/**
 * @param {import('../../../../env').Env} env
 */
export async function update(request, env) {
	const body = await request.json()

	const pathParamsSchema = z.object({
		id: z.uuid(),
	})

	const bookUpdateSchema = z.object({
		title: z.string(),
		author: z.string(),
		category: z.string(),
	})

	const updateBookBodySchema = z.object({
		data: bookUpdateSchema.partial().refine((data) => Object.keys(data).length > 0, {
			message: 'Submit at least one field to update.',
		}),
	})
	const { id: bookId } = pathParamsSchema.parse(request.params)

	const { data } = updateBookBodySchema.parse(body)

	try {
		const useCase = makeUpdateBookUseCase(env.d1_edge_library)

		await useCase.execute({ bookId, data })
		return jsonResponse({ message: 'Book updated successfully' }, 200)
	} catch (error) {
		if (error instanceof BookNotFoundError) {
			return jsonResponse({ message: error.message }, 400)
		}
		throw error
	}
}
