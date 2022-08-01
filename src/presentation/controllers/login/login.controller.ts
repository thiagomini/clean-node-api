import { Authentication } from '../../../domain/use-cases/authentication'
import { InvalidParamException, MissingParamException } from '../../errors'
import { Controller, EmailValidator, HttpRequest, HttpResponse, HttpStatusCodes } from '../../protocols'
import { firstMissingAttributeOf } from '../../utils'
import { internalServerError, badRequest, unauthorized } from '../../utils/http-responses-factories'
import { Validation } from '../../validators'

export class LoginController implements Controller {
  private readonly requiredFields = ['email', 'password']

  constructor (private readonly emailValidator: EmailValidator, private readonly authentication: Authentication, private readonly validation: Validation) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      return await this.loginUser(httpRequest)
    } catch (error) {
      console.error(error)
      return internalServerError(error as Error)
    }
  }

  private async loginUser (httpRequest: HttpRequest): Promise<HttpResponse> {
    const errorOrUndefined = this.validation.validate(httpRequest.body)

    if (errorOrUndefined) {
      return badRequest(errorOrUndefined)
    }

    const missingAttribute = firstMissingAttributeOf(httpRequest.body, this.requiredFields)

    if (missingAttribute) {
      return badRequest(new MissingParamException(missingAttribute))
    }

    const { email, password } = httpRequest.body

    const emailIsValid = this.emailValidator.isValid(email)

    if (!emailIsValid) {
      return badRequest(new InvalidParamException('email'))
    }

    const accessToken = await this.authentication.authenticate(email, password)
    if (!accessToken) {
      return unauthorized()
    }

    return {
      statusCode: HttpStatusCodes.OK,
      body: {
        accessToken
      }
    }
  }
}
