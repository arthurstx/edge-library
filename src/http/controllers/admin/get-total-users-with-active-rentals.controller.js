import { jsonResponse } from 'src/helpers/json'
import { makeGetTotalUsersWithActiveRentalsUseCase } from 'src/services/factories/make-get-total-users-with-active-rentals'

export async function getTotalUsersWithActiveRentals(request, env, _ctx) {
	try {
		const useCase = makeGetTotalUsersWithActiveRentalsUseCase(env.d1_edge_library)
		const { total } = await useCase.execute()
		return jsonResponse({ total }, 200)
	} catch (error) {
		console.error(error)
		throw error
	}
}
