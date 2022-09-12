import { AccessDeniedException } from '../errors'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { forbidden } from '../utils/http-responses-factories'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest<any>): Promise<HttpResponse> {
    return forbidden(new AccessDeniedException())
  }
}
