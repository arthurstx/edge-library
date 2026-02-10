import { createRouter } from 'src/helpers/routes'
import { create } from './create-book.controller'
import { requireAuth } from 'src/http/middlewares/require-auth'
import { verifyUserRole } from 'src/http/middlewares/verify-user-role'

const bookRoute = createRouter()

bookRoute.post('/create', requireAuth, verifyUserRole, create)

export { bookRoute }
