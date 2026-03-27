import { createRouter } from 'src/helpers/routes'
import { requireAuth } from 'src/http/middlewares/require-auth'
import { verifyUserRole } from 'src/http/middlewares/verify-user-role'
import { getTotalNonAdminUsers } from './get-total-non-admin-users.controller'
import { getTotalActiveRentals } from './get-total-active-rentals.controller'
import { getTotalUsersWithActiveRentals } from './get-total-users-with-active-rentals.controller'

const adminRoute = createRouter()

adminRoute.get('/stats/users', requireAuth, verifyUserRole, getTotalNonAdminUsers)
adminRoute.get('/stats/rentals/active', requireAuth, verifyUserRole, getTotalActiveRentals)
adminRoute.get('/stats/users/with-active-rentals', requireAuth, verifyUserRole, getTotalUsersWithActiveRentals)

export { adminRoute }
