import { AccessDeniedException } from '../errors'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { forbidden } from '../utils/http-responses-factories'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByTokenUseCase: any) {

  }

  async handle (httpRequest: HttpRequest<any>): Promise<HttpResponse> {
    await this.loadAccountByTokenUseCase.load(httpRequest?.headers?.['x-access-token'])
    return forbidden(new AccessDeniedException())
  }
}
