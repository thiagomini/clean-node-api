import { InvalidParamException, MissingParamException } from '../../errors'
import { AddAccountUseCase, badRequest, Controller, EmailValidator, HttpRequest, HttpResponse, HttpStatusCodes, internalServerError } from './signup.protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccountUseCase: AddAccountUseCase
  ) {}

  private readonly requiredFields = ['email', 'name', 'password', 'passwordConfirmation']

  handle (httpRequest: HttpRequest): HttpResponse | undefined {
    try {
      return this.signUp(httpRequest)
    } catch (error) {
      return internalServerError(error as Error)
    }
  }

  private signUp (httpRequest: HttpRequest): HttpResponse | undefined {
    const { body } = httpRequest
    for (const requiredField of this.requiredFields) {
      if (!body[requiredField]) {
        return badRequest(new MissingParamException(requiredField))
      }
    }

    const { name, password, passwordConfirmation, email } = body

    if (password !== passwordConfirmation) {
      return badRequest(new InvalidParamException('passwordConfirmation'))
    }

    if (!this.emailValidator.isValid(email)) {
      return badRequest(new InvalidParamException('email'))
    }

    const account = this.addAccountUseCase.add({
      name,
      email,
      password
    })

    return {
      statusCode: HttpStatusCodes.OK,
      body: account
    }
  }
}