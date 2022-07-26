import { InvalidParamException, MissingParamException } from '../../errors'
import { badRequest, Controller, EmailValidator, HttpResponse, HttpStatusCodes } from '../../protocols'
import { LoginControllerRequest } from './login.controller.interfaces'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) { }

  async handle (httpRequest: LoginControllerRequest): Promise<HttpResponse> {
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
  }
}
