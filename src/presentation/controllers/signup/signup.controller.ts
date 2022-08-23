import { Authentication } from '../../../domain/use-cases/authentication'
import { badRequest, internalServerError, ok } from '../../utils/http-responses-factories'
import { AddAccountUseCase, Controller, HttpRequest, HttpResponse, Validation } from './signup.controller.protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccountUseCase: AddAccountUseCase,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      return await this.signUp(httpRequest)
    } catch (error) {
      console.error(error)
      return internalServerError(error as Error)
    }
  }

  private async signUp (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    const errorOrUndefined = this.validation.validate(body)

    if (errorOrUndefined) {
      return badRequest(errorOrUndefined)
    }

    const { name, password, email } = body

    const account = await this.addAccountUseCase.add({
      name,
      email,
      password
    })

    await this.authentication.authenticate({
      email,
      password
    })

    return ok(account)
  }
}
