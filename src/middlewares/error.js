// errors.js
import { ZodError } from 'zod'
import { jsonResponse } from '../helpers/json.js'

export function handleError(err, env) {
	if (err instanceof ZodError) {
		return jsonResponse(
			{
				message: 'Validation Error',
				issues: err.issues,
			},
			400,
		)
	}

	if (env.NODE_ENV === 'dev') {
		console.error(err)
	}

	return jsonResponse({ message: 'Internal Server Error' }, 500)
}
