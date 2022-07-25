import { SignUpController } from '../../presentation/controllers/signup/signup.controller'
import { EmailValidatorAdapter } from '../../utils/email-validator.adapter'
import { DbAddAccountUseCase } from '../../data/use-cases/add-account/db-add-account.use-case'
import { BCryptEncrypterAdapter } from '../../infra/cryptography/bcrypt-encrypter.adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account-mongo.repository'
import { Controller } from '../../presentation/protocols'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log-mongo.repository'
import { LogDecoratorController } from '../decorators/log.decorator'

export const createSignupController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const dbAddAccountUseCase = createDbAddAccount()
  const signupController = new SignUpController(emailValidatorAdapter, dbAddAccountUseCase)

  const logErrorRepository = new LogMongoRepository()
  const logDecoratorController = new LogDecoratorController(signupController, logErrorRepository)

  return logDecoratorController
}

const createDbAddAccount = (): DbAddAccountUseCase => {
  const encrypter = new BCryptEncrypterAdapter()
  const addAccountRepository = new AccountMongoRepository()

  return new DbAddAccountUseCase(encrypter, addAccountRepository)
}
