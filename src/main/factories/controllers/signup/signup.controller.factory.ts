import { SignUpController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { decorateWithLogger } from '@/main/factories/decorators'
import {
  createDbAddAccount,
  createDbAuthentication,
} from '@/main/factories/use-cases'
import { createSignupValidation } from './signup-validation.factory'

export const createSignupController = (): Controller => {
  const signupController = createRawSignupController()
  return decorateWithLogger(signupController)
}

const createRawSignupController = (): SignUpController => {
  const dbAddAccountUseCase = createDbAddAccount()
  const validation = createSignupValidation()
  const authentication = createDbAuthentication()
  const signupController = new SignUpController(
    dbAddAccountUseCase,
    validation,
    authentication
  )
  return signupController
}
