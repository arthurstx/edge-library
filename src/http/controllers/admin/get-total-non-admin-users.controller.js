import { jsonResponse } from 'src/helpers/json'
import { makeGetTotalNonAdminUsersUseCase } from 'src/services/factories/make-get-total-non-admin-users'

export async function getTotalNonAdminUsers(request, env, _ctx) {
	try {
		const useCase = makeGetTotalNonAdminUsersUseCase(env.d1_edge_library)
		const { total } = await useCase.execute()
		return jsonResponse({ total }, 200)
	} catch (error) {
		console.error(error)
		throw error
	}
}
