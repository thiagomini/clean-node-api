import { LoadAccountByTokenUseCase } from '../../domain/use-cases/authentication'
import { AccessDeniedException } from '../errors'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { forbidden, internalServerError, ok } from '../utils/http-responses-factories'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByTokenUseCase: LoadAccountByTokenUseCase) {

  }

  async handle (httpRequest: HttpRequest<any>): Promise<HttpResponse> {
    try {
      return await this.verifyAccessTokenFrom(httpRequest)
    } catch (error) {
      return internalServerError(error as Error)
    }
  }

  private async verifyAccessTokenFrom (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest?.headers?.['x-access-token']

    if (!accessToken) {
      return forbidden(new AccessDeniedException())
    }

    const existingUser = await this.loadAccountByTokenUseCase.load(accessToken)
    if (existingUser) {
      return ok({
        accountId: existingUser.id
      })
    }

    return forbidden(new AccessDeniedException())
  }
}
