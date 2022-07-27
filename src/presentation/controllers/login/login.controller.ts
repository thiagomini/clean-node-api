import { InvalidParamException, MissingParamException } from '../../errors'
import { badRequest, Controller, EmailValidator, HttpResponse, HttpStatusCodes, internalServerError } from '../../protocols'
import { LoginControllerRequest } from './login.controller.interfaces'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) { }

  async handle (httpRequest: LoginControllerRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body ?? {}

      if (!email) {
        return badRequest(new MissingParamException('email'))
      }

      if (!password) {
        return badRequest(new MissingParamException('password'))
      }

      const emailIsValid = this.emailValidator.isValid(email)

      if (!emailIsValid) {
        return badRequest(new InvalidParamException('email'))
      }

      return {
        statusCode: HttpStatusCodes.OK,
        body: {}
      }
    } catch (error) {
      console.error(error)
      return internalServerError(error as Error)
    }
  }
}
