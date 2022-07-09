import { InvalidParamException, MissingParamException, ServerError } from '../errors'
import { badRequest, Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  private readonly requiredFields = ['email', 'name', 'password', 'passwordConfirmation']

  handle (httpRequest: HttpRequest): HttpResponse | undefined {
    try {
      for (const requiredField of this.requiredFields) {
        if (!httpRequest.body[requiredField]) {
          return badRequest(new MissingParamException(requiredField))
        }
      }

      if (!this.emailValidator.isValid(httpRequest.body.email)) {
        return badRequest(new InvalidParamException('email'))
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError(error as Error)
      }
    }
  }
}
