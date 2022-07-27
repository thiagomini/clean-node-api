import { InvalidParamException, MissingParamException } from '../../errors'
import { firstMissingAttributeOf } from '../../utils'
import { AddAccountUseCase, badRequest, Controller, EmailValidator, HttpRequest, HttpResponse, internalServerError, ok } from './signup.protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccountUseCase: AddAccountUseCase
  ) {}

  private readonly requiredFields = ['email', 'name', 'password', 'passwordConfirmation']

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
    const missingAttribute = firstMissingAttributeOf(httpRequest.body, this.requiredFields)

    if (missingAttribute) {
      return badRequest(new MissingParamException(missingAttribute))
    }

    const { name, password, passwordConfirmation, email } = body

    if (password !== passwordConfirmation) {
      return badRequest(new InvalidParamException('passwordConfirmation'))
    }

    if (!this.emailValidator.isValid(email)) {
      return badRequest(new InvalidParamException('email'))
    }

    const account = await this.addAccountUseCase.add({
      name,
      email,
      password
    })

    return ok(account)
  }
}
