import { MissingParamException } from '../errors'
import { HttpRequest, HttpResponse, badRequest } from '../protocols'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse | undefined {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamException('name'))
    }

    if (!httpRequest.body.email) {
      return badRequest(new MissingParamException('email'))
    }
  }
}
