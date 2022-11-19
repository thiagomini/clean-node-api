import { Role } from '@/auth'
import { LoadAccountByTokenUseCase } from '@/domain/use-cases/authentication'
import { AccessDeniedException } from '@/presentation/errors'
import { HttpResponse, Middleware } from '@/presentation/protocols'
import { forbidden, internalServerError, ok } from '@/presentation/utils'

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByTokenUseCase: LoadAccountByTokenUseCase,
    private readonly role?: Role
  ) {}

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      return await this.verifyAccessTokenFrom(request)
    } catch (error) {
      return internalServerError(error as Error)
    }
  }

  private async verifyAccessTokenFrom(
    request: AuthMiddleware.Request
  ): Promise<HttpResponse> {
    const accessToken = request.accessToken

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

export namespace AuthMiddleware {
  export interface Request {
    accessToken?: string
  }
}
