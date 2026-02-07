import { createRouter } from 'src/helpers/routes'
import { register } from './register.controller'
import { authenticate } from './authenticate.controller'
import { refresh } from './refresh.controller'
import { verifyJWT } from 'src/http/middlewares/verify-jwt'
import { verifyUserRole } from 'src/http/middlewares/verify-user-role'
import { logout } from './logout.controller'
import { profile } from './profile.controller'

const authRoute = createRouter()

authRoute.post('/register', register)
authRoute.post('/login', authenticate)
authRoute.post('/refresh', refresh)
authRoute.post('/logout', logout)
authRoute.get('/me', verifyJWT, profile)

/*---- TEST ----- */
authRoute.get('/protected', verifyJWT, (_request, _env, _ctx) => {
	return new Response('successfully', { status: 200 })
})
authRoute.get('/protected-admin', verifyJWT, verifyUserRole, (_request, _env, _ctx) => {
	return new Response('successfully', { status: 200 })
})

export { authRoute }
