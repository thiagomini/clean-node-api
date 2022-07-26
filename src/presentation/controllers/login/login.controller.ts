import { MissingParamException } from '../../errors'
import { badRequest, Controller, HttpRequest, HttpResponse, HttpStatusCodes } from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamException('email'))
    }

    if (!httpRequest.body.password) {
      return badRequest(new MissingParamException('password'))
    }

    return {
      statusCode: HttpStatusCodes.OK,
      body: {}
    }
  }
}
