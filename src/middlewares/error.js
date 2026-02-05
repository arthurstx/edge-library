// errors.js
import { ZodError } from 'zod'
import { json } from '../helpers/json.js'

export function handleError(err, env) {
	if (err instanceof ZodError) {
		return json(
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

	return json({ message: 'Internal Server Error' }, 500)
}
