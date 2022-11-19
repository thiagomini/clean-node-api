import { LoginController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { decorateWithLogger } from '../../decorators'
import { createDbAuthentication } from '../../use-cases/authentication'
import { createLoginValidation } from './login-validation.factory'

export const createLoginController = (): Controller => {
  const rawLoginController = createRawLoginController()
  return decorateWithLogger(rawLoginController)
}

const createRawLoginController = (): LoginController => {
  const authentication = createDbAuthentication()
  const validation = createLoginValidation()

  return new LoginController(authentication, validation)
}
