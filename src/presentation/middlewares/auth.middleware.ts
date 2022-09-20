import { Role } from '../../auth'
import { AUTH_HEADER } from './auth-header-key'
import {
  HttpRequest,
  HttpResponse,
  Middleware,
  AccessDeniedException,
  LoadAccountByTokenUseCase,
  internalServerError,
  forbidden,
  ok,
} from './auth.middleware.protocols'

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByTokenUseCase: LoadAccountByTokenUseCase,
    private readonly role?: Role
  ) {}

  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse> {
    try {
      return await this.verifyAccessTokenFrom(httpRequest)
    } catch (error) {
      return internalServerError(error as Error)
    }
  }

  private async verifyAccessTokenFrom(
    httpRequest: HttpRequest
  ): Promise<HttpResponse> {
    const accessToken = httpRequest?.headers?.[AUTH_HEADER]

    if (!accessToken) {
      return forbidden(new AccessDeniedException())
    }

    const existingUser = await this.loadAccountByTokenUseCase.load(
      accessToken,
      this.role
    )
    if (existingUser) {
      return ok({
        accountId: existingUser.id,
      })
    }

    return forbidden(new AccessDeniedException())
  }
}
