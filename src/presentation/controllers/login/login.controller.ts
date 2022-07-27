import { Authentication } from '../../../domain/use-cases/authentication'
import { InvalidParamException, MissingParamException } from '../../errors'
import { badRequest, Controller, EmailValidator, HttpRequest, HttpResponse, HttpStatusCodes, internalServerError, unauthorized } from '../../protocols'
import { firstMissingAttributeOf } from '../../utils'

export class LoginController implements Controller {
  private readonly requiredFields = ['email', 'password']

  constructor (private readonly emailValidator: EmailValidator, private readonly authentication: Authentication) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const missingAttribute = firstMissingAttributeOf(httpRequest.body, this.requiredFields)

      if (missingAttribute) {
        return badRequest(new MissingParamException(missingAttribute))
      }

      const { email, password } = httpRequest.body

      const emailIsValid = this.emailValidator.isValid(email)

      if (!emailIsValid) {
        return badRequest(new InvalidParamException('email'))
      }

      const authToken = await this.authentication.authenticate(email, password)
      if (!authToken) {
        return unauthorized()
      }

      return {
        statusCode: HttpStatusCodes.OK,
        body: {}
      }
    } catch (error) {
      console.error(error)
      return internalServerError(error as Error)
    }
  }
}
