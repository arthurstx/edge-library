import { createRouter } from './middlewares/routes'
import { handleError } from './middlewares/error.js'
import { jsonResponse } from './helpers/json.js'
import { authRoute } from './http/controllers/auth/routes'
const app = createRouter()

/* ------- routes ------- */

app.get('/health', () => jsonResponse({ status: 'ok' }))
app.route('/auth', authRoute)

/* ---------------- export ---------------- */

export default {
	fetch: (request, env, ctx) => {
		try {
			return app.handle(request, env, ctx)
		} catch (err) {
			return handleError(err, env)
		}
	},
}
