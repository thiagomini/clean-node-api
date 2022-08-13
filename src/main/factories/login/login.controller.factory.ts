import { DbAuthenticationUseCase } from '../../../data/use-cases/authentication/db-authentication.use-case'
import { Authentication } from '../../../domain/use-cases/authentication'
import { BCryptHasherAdapter } from '../../../infra/cryptography/bcrypt-hasher.adapter'
import { JwtEcnrypterAdapter } from '../../../infra/cryptography/jwt-encrypter.adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account-mongo.repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-mongo.repository'
import { LoginController } from '../../../presentation/controllers/login/login.controller'
import { Controller } from '../../../presentation/protocols'
import env from '../../config/env'
import { LogDecoratorController } from '../../decorators/log.decorator'
import { createValidation } from './login-validation.factory'

export const createLoginController = (): Controller => {
  const loginController = createRawLoginController()

  const logMongoRepository = new LogMongoRepository()
  return new LogDecoratorController(loginController, logMongoRepository)
}

const createRawLoginController = (): LoginController => {
  const authentication = createAuthentication()
  const validation = createValidation()

  return new LoginController(authentication, validation)
}

const createAuthentication = (): Authentication => {
  const accountMongoRepository = new AccountMongoRepository()
  const hashComparer = new BCryptHasherAdapter()
  const encrypter = new JwtEcnrypterAdapter(env.jwtSecret)

  const dbAuthentication = new DbAuthenticationUseCase(
    accountMongoRepository,
    hashComparer,
    encrypter,
    accountMongoRepository
  )

  return dbAuthentication
}
