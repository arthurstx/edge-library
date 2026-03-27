import { jsonResponse } from 'src/helpers/json'
import { makeGetUserTotalRentalsUseCase } from 'src/services/factories/make-get-user-total-rentals'

export async function getUserTotalRentals(request, env, ctx) {
	const userId = ctx.user.id
	try {
		const useCase = makeGetUserTotalRentalsUseCase(env.d1_edge_library)
		const { total } = await useCase.execute({ userId })
		return jsonResponse({ total }, 200)
	} catch (error) {
		console.error(error)
		throw error
	}
}
