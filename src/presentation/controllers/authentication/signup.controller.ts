import { Role } from '@/auth'
import { AddAccountUseCase } from '@/domain/use-cases/account/add-account'
import { Authentication } from '@/domain/use-cases/authentication'
import { ExistingEmailException } from '@/presentation/errors'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'
import {
  badRequest,
  forbidden,
  internalServerError,
  ok,
} from '@/presentation/utils/http-responses-factories'

export class SignUpController implements Controller {
  constructor(
    private readonly addAccountUseCase: AddAccountUseCase,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle(request: SignUpController.Request): Promise<HttpResponse> {
    try {
      return await this.signUp(request)
    } catch (error) {
      console.error(error)
      return internalServerError(error as Error)
    }
  }

  private async signUp(
    request: SignUpController.Request
  ): Promise<HttpResponse> {
    const errorOrUndefined = this.validation.validate(request)

    if (errorOrUndefined) {
      return badRequest(errorOrUndefined)
    }

    const { name, password, email } = request

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

export namespace SignUpController {
  export interface Request {
    name: string
    password: string
    email: string
    passwordConfirmation: string
  }
}
