import { createRouter } from 'src/helpers/routes'
import { create } from './create-book.controller'
import { requireAuth } from 'src/http/middlewares/require-auth'
import { verifyUserRole } from 'src/http/middlewares/verify-user-role'
import { addStock } from './add-stock.controller'
import { update } from './update-book.controller'
import { findBook } from './find-book.controller'

const bookRoute = createRouter()

bookRoute.post('/create', requireAuth, verifyUserRole, create)
bookRoute.post('/add-stock/:id', requireAuth, verifyUserRole, addStock)
bookRoute.patch('/update/:id', requireAuth, verifyUserRole, update)
bookRoute.get('/find/:id', findBook)

export { bookRoute }
