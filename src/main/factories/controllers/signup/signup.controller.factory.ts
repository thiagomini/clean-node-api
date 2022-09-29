import { SignUpController } from '@/presentation/controllers/authentication/signup/signup.controller'
import { Controller } from '@/presentation/protocols'
import { decorateWithLogger } from '../../decorators'
import { createDbAddAccount } from '../../use-cases'
import { createDbAuthentication } from '../../use-cases/authentication'
import { createLoginValidation } from '../login'

export const createSignupController = (): Controller => {
  const signupController = createRawSignupController()
  return decorateWithLogger(signupController)
}

const createRawSignupController = (): SignUpController => {
  const dbAddAccountUseCase = createDbAddAccount()
  const validation = createLoginValidation()
  const authentication = createDbAuthentication()
  const signupController = new SignUpController(
    dbAddAccountUseCase,
    validation,
    authentication
  )
  return signupController
}
