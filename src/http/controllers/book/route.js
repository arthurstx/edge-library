import { createRouter } from 'src/helpers/routes'
import { create } from './create-book.controller'

const bookRoute = createRouter()

bookRoute.post('/create', create)

export { bookRoute }
