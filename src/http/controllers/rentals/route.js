import { createRouter } from 'src/helpers/routes'
import { requireAuth } from 'src/http/middlewares/require-auth'
import { verifyUserRole } from 'src/http/middlewares/verify-user-role'
import { create } from './create-rental.controller'
import { list } from './list-active-user-rentals.controller'
import { history } from './list-rentals-history.controller'
import { updateStatus } from './update-status.controller'
import { listAll } from './list-all-rentals.controller'
import { getUserTotalRentals } from './get-user-total-rentals.controller'
import { getUserActiveRentals } from './get-user-active-rentals.controller'

const rentalRoute = createRouter()

rentalRoute.post('', requireAuth, verifyUserRole, create)
rentalRoute.get('', requireAuth, verifyUserRole, listAll)
rentalRoute.get('/active', requireAuth, list)
rentalRoute.get('/history', requireAuth, history)
rentalRoute.patch('/:id/return', requireAuth, verifyUserRole, updateStatus)

rentalRoute.get('/stats/total', requireAuth, getUserTotalRentals)
rentalRoute.get('/stats/active', requireAuth, getUserActiveRentals)

export { rentalRoute }
