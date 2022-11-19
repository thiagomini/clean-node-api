import { Authentication } from '@/domain/use-cases/authentication'

import {
  Controller,
  HttpResponse,
  HttpStatusCodes,
  Validation,
} from '@/presentation/protocols'
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

  async handle(request: LoginController.Request): Promise<HttpResponse> {
    try {
      return await this.loginUser(request)
    } catch (error) {
      console.error(error)
      return internalServerError(error as Error)
    }
  }

  private async loginUser(
    request: LoginController.Request
  ): Promise<HttpResponse> {
    const errorOrUndefined = this.validation.validate(request)

    if (errorOrUndefined) {
      return badRequest(errorOrUndefined)
    }

    const { email, password } = request

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

export namespace LoginController {
  export interface Request {
    email: string
    password: string
  }
}
