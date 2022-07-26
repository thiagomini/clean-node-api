import { InvalidParamException, MissingParamException } from '../../errors'
import { badRequest, Controller, EmailValidator, HttpRequest, HttpResponse, HttpStatusCodes } from '../../protocols'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamException('email'))
    }

    if (!httpRequest.body.password) {
      return badRequest(new MissingParamException('password'))
    }

    const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)

    if (!emailIsValid) {
      return badRequest(new InvalidParamException('email'))
    }

    return {
      statusCode: HttpStatusCodes.OK,
      body: {}
    }
  }
}
