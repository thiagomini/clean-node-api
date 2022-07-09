import { InvalidParamException, MissingParamException } from '../errors'
import { badRequest, Controller, EmailValidator, HttpRequest, HttpResponse, internalServerError } from '../protocols'

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
      return internalServerError(error as Error)
    }
  }
}
