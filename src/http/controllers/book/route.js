import { createRouter } from 'src/helpers/routes'
import { create } from './create-book.controller'
import { requireAuth } from 'src/http/middlewares/require-auth'
import { verifyUserRole } from 'src/http/middlewares/verify-user-role'
import { addStock } from './add-stock.controller'

const bookRoute = createRouter()

bookRoute.post('/create', requireAuth, verifyUserRole, create)
bookRoute.patch('/add-stock/:id', requireAuth, verifyUserRole, addStock)

export { bookRoute }
