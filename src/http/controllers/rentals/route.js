import { createRouter } from 'src/helpers/routes'
import { requireAuth } from 'src/http/middlewares/require-auth'
import { verifyUserRole } from 'src/http/middlewares/verify-user-role'
import { create } from './create-rental.controller'

const rentalRoute = createRouter()

rentalRoute.post('/create', requireAuth, verifyUserRole, create)

export { rentalRoute }
