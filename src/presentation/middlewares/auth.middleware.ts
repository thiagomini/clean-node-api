import { LoadAccountByTokenUseCase } from '../../domain/use-cases/authentication'
import { AccessDeniedException } from '../errors'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { forbidden, ok } from '../utils/http-responses-factories'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByTokenUseCase: LoadAccountByTokenUseCase) {

  }

  async handle (httpRequest: HttpRequest<any>): Promise<HttpResponse> {
    const accessToken = httpRequest?.headers?.['x-access-token']

    if (accessToken) {
      const existingUser = await this.loadAccountByTokenUseCase.load(httpRequest?.headers?.['x-access-token'])
      if (existingUser) {
        return ok({
          accountId: existingUser.id
        })
      }
    }

    return forbidden(new AccessDeniedException())
  }
}
