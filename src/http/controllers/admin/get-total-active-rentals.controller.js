import { jsonResponse } from 'src/helpers/json'
import { makeGetTotalActiveRentalsUseCase } from 'src/services/factories/make-get-total-active-rentals'

export async function getTotalActiveRentals(request, env, _ctx) {
	try {
		const useCase = makeGetTotalActiveRentalsUseCase(env.d1_edge_library)
		const { total } = await useCase.execute()
		return jsonResponse({ total }, 200)
	} catch (error) {
		console.error(error)
		throw error
	}
}
