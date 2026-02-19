import { createRouter } from 'src/helpers/routes'
import { requireAuth } from 'src/http/middlewares/require-auth'
import { verifyUserRole } from 'src/http/middlewares/verify-user-role'
import { create } from './create-rental.controller'
import { list } from './list-active-user-rentals.controller'
import { history } from './list-rentals-history.controller'

const rentalRoute = createRouter()

rentalRoute.post('/create', requireAuth, verifyUserRole, create)
rentalRoute.get('/list-active', requireAuth, list)
rentalRoute.get('/list-history', requireAuth, history)

export { rentalRoute }
