import { createRouter } from './middlewares/routes'
import { handleError } from './middlewares/error.js'
import { json } from './helpers/json.js'
const app = createRouter()

/* ------- routes ------- */

app.get('/health', () => json({ status: 'ok' }))

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
