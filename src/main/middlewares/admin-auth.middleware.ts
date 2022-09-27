import { Role } from '../../auth'
import { adaptMiddleware } from '../adapters/express-middleware.adapter'
import { createAuthMiddleware } from '../factories/middlewares/auth.middleware.factory'

export const adminAuthMiddleware = adaptMiddleware(
  createAuthMiddleware(Role.Admin)
)
