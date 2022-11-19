import { Authentication } from '@/domain/use-cases/authentication'
import { Role } from '@/auth'
import { ExistingEmailException } from '@/presentation/errors'
import {
  badRequest,
  forbidden,
  internalServerError,
  ok,
} from '@/presentation/utils/http-responses-factories'
import { AddAccountUseCase } from '@/domain/use-cases/account/add-account'
import {
  Controller,
  Validation,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols'

export class SignUpController implements Controller {
  constructor(
    private readonly addAccountUseCase: AddAccountUseCase,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      return await this.signUp(httpRequest)
    } catch (error) {
      console.error(error)
      return internalServerError(error as Error)
    }
  }

  private async signUp(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    const errorOrUndefined = this.validation.validate(body)

    if (errorOrUndefined) {
      return badRequest(errorOrUndefined)
    }

    const { name, password, email } = body

    const account = await this.addAccountUseCase.findOrCreate({
      name,
      email,
      password,
      role: Role.User,
    })

    if (!account.isNew) {
      return forbidden(new ExistingEmailException(email))
    }

    const accessToken = await this.authentication.authenticate({
      email,
      password,
    })

    return ok({ accessToken })
  }
}
