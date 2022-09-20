import { Role } from '../../../auth'
import { AuthMiddleware } from '../../../presentation/middlewares/auth.middleware'
import { Middleware } from '../../../presentation/protocols'
import { createDbLoadAccountByToken } from '../use-cases/account'

export const createAuthMiddleware = (role?: Role): Middleware => {
  const dbLoadAccountByTokenUseCase = createDbLoadAccountByToken()
  const middleware = new AuthMiddleware(dbLoadAccountByTokenUseCase, role)
  return middleware
}
