import { MissingParamException } from '../errors'
import { HttpRequest, HttpResponse, badRequest } from '../protocols'

export class SignUpController {
  private readonly requiredFields = ['email', 'name', 'password', 'passwordConfirmation']

  handle (httpRequest: HttpRequest): HttpResponse | undefined {
    for (const requiredField of this.requiredFields) {
      if (!httpRequest.body[requiredField]) {
        return badRequest(new MissingParamException(requiredField))
      }
    }
  }
}
