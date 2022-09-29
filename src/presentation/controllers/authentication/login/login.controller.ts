import { Authentication } from '@/domain/use-cases/authentication'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  HttpStatusCodes,
  Validation,
} from '../../../protocols'
import {
  badRequest,
  internalServerError,
  unauthorized,
} from '@/presentation/utils/http-responses-factories'

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      return await this.loginUser(httpRequest)
    } catch (error) {
      console.error(error)
      return internalServerError(error as Error)
    }
  }

  private async loginUser(httpRequest: HttpRequest): Promise<HttpResponse> {
    const errorOrUndefined = this.validation.validate(httpRequest.body)

    if (errorOrUndefined) {
      return badRequest(errorOrUndefined)
    }

    const { email, password } = httpRequest.body

    const accessToken = await this.authentication.authenticate({
      email,
      password,
    })
    if (!accessToken) {
      return unauthorized()
    }

    return {
      statusCode: HttpStatusCodes.OK,
      body: {
        accessToken,
      },
    }
  }
}
