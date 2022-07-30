import { DbAddAccountUseCase } from '../../data/use-cases/add-account/db-add-account.use-case'
import { BCryptEncrypterAdapter } from '../../infra/cryptography/bcrypt-encrypter.adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account-mongo.repository'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log-mongo.repository'
import { SignUpController } from '../../presentation/controllers/signup/signup.controller'
import { Controller } from '../../presentation/protocols'
import { LogDecoratorController } from '../decorators/log.decorator'
import { createValidation } from './signup-validation.factory'

export const createSignupController = (): Controller => {
  const signupController = createRawSignupController()
  const signupControllerWithLogger = decorateController(signupController)
  return signupControllerWithLogger
}

const createRawSignupController = (): SignUpController => {
  const dbAddAccountUseCase = createDbAddAccount()
  const validation = createValidation()

  const signupController = new SignUpController(dbAddAccountUseCase, validation)
  return signupController
}

const createDbAddAccount = (): DbAddAccountUseCase => {
  const encrypter = new BCryptEncrypterAdapter()
  const addAccountRepository = new AccountMongoRepository()

  return new DbAddAccountUseCase(encrypter, addAccountRepository)
}

const decorateController = (signupController: SignUpController): LogDecoratorController => {
  const logErrorRepository = new LogMongoRepository()
  const logDecoratorController = new LogDecoratorController(signupController, logErrorRepository)

  return logDecoratorController
}
