import { createRouter } from 'src/middlewares/routes'
import { register } from './register.controller'
import { authenticate } from './authenticate.controller'
import { refresh } from './refresh'

const authRoute = createRouter()

authRoute.post('/register', register)
authRoute.post('/login', authenticate)
authRoute.post('/refresh', refresh)

export { authRoute }
