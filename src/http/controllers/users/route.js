import { createRouter } from 'src/helpers/routes'
import { requireAuth } from 'src/http/middlewares/require-auth'
import { verifyUserRole } from 'src/http/middlewares/verify-user-role'
import { list } from './list.controller'

const usersRoute = createRouter()

usersRoute.get('', requireAuth, verifyUserRole, list)

export { usersRoute }
