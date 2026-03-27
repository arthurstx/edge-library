import { jsonResponse } from 'src/helpers/json'
import { makeGetUserActiveRentalsUseCase } from 'src/services/factories/make-get-user-active-rentals'

export async function getUserActiveRentals(request, env, ctx) {
	const userId = ctx.user.id
	try {
		const useCase = makeGetUserActiveRentalsUseCase(env.d1_edge_library)
		const { total } = await useCase.execute({ userId })
		return jsonResponse({ total }, 200)
	} catch (error) {
		console.error(error)
		throw error
	}
}
