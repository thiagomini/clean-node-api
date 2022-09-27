import { adaptMiddleware } from '../adapters/express-middleware.adapter'
import { createAuthMiddleware } from '../factories/middlewares/auth.middleware.factory'

export const userAuthMiddleware = adaptMiddleware(createAuthMiddleware())
