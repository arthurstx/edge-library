import { createRouter } from './helpers/routes'
import { jsonResponse } from './helpers/json.js'
import { authRoute } from './http/controllers/auth/routes'
import { bookRoute } from './http/controllers/book/route'
import { rentalRoute } from './http/controllers/rentals/route'

const app = createRouter()
/** ------ ROUTES ------ */
app.get('/health', () => jsonResponse({ status: 'ok' }))
app.route('/auth', authRoute)
app.route('/book', bookRoute)
app.route('/rental', rentalRoute)

export default {
	fetch: (request, env, ctx) => app.handle(request, env, ctx),
}
