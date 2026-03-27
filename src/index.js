import { createRouter } from './helpers/routes'
import { jsonResponse } from './helpers/json.js'
import { authRoute } from './http/controllers/auth/routes'
import { bookRoute } from './http/controllers/book/route'
import { rentalRoute } from './http/controllers/rentals/route'
import { adminRoute } from './http/controllers/admin/route'

const app = createRouter()
/** ------ ROUTES ------ */
app.get('/health', () => jsonResponse({ status: 'ok' }))
app.route('/auth', authRoute)
app.route('/book', bookRoute)
app.route('/rental', rentalRoute)
app.route('/rentals', rentalRoute)
app.route('/admin', adminRoute)

export default {
	fetch: (request, env, ctx) => app.handle(request, env, ctx),
}
