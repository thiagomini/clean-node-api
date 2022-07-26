import { MissingParamException } from '../../errors'
import { badRequest, Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return badRequest(new MissingParamException('email'))
  }
}
