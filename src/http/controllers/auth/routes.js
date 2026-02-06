import { createRouter } from 'src/middlewares/routes'
import { register } from './register.controller'

const authRoute = createRouter()

authRoute.post('/register', register)

export { authRoute }
