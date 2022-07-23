import { SignUpController } from '../../presentation/controllers/signup/signup.controller'
import { EmailValidatorAdapter } from '../../utils/email-validator.adapter'
import { DbAddAccountUseCase } from '../../data/use-cases/add-account/db-add-account.use-case'
import { BCryptEncrypterAdapter } from '../../infra/cryptography/bcrypt-encrypter.adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account-mongo.repository'

export const createSignupController = (): SignUpController => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const dbAddAccountUseCase = createDbAddAccount()
  const signupController = new SignUpController(emailValidatorAdapter, dbAddAccountUseCase)
  return signupController
}

const createDbAddAccount = (): DbAddAccountUseCase => {
  const encrypter = new BCryptEncrypterAdapter()
  const addAccountRepository = new AccountMongoRepository()

  return new DbAddAccountUseCase(encrypter, addAccountRepository)
}
