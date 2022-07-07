import { MissingParamException } from '../errors'
import { HttpRequest, HttpResponse, badRequest, Controller } from '../protocols'

export class SignUpController implements Controller {
  private readonly requiredFields = ['email', 'name', 'password', 'passwordConfirmation']

  handle (httpRequest: HttpRequest): HttpResponse | undefined {
    for (const requiredField of this.requiredFields) {
      if (!httpRequest.body[requiredField]) {
        return badRequest(new MissingParamException(requiredField))
      }
    }
  }
}
