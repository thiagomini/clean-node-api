import { Role } from '@/auth'
import { Optional } from '@/utils'
import { fakeAccount } from '../../domain/mocks'
import { AccessDeniedException } from '@/presentation/errors'
import { AuthMiddleware } from '@/presentation/middlewares'
import { AccountModel } from '@/domain/models'
import { LoadAccountByTokenUseCase } from '@/domain/use-cases/authentication'
import { forbidden, ok, internalServerError } from '@/presentation/utils'

describe('AuthMiddleware', () => {
  describe('handle', () => {
    it('should return 403 if no x-access-token header is provided', async () => {
      // Arrange
      const { sut } = createSut()
      const request = {}

      // Act
      const response = await sut.handle(request)

      // Assert
      expect(response).toEqual(forbidden(new AccessDeniedException()))
    })

    it('should call loadAccountByToken with correct values', async () => {
      // Arrange
      const { sut, loadAccountByTokenStub } = createSut(Role.Admin)
      const request = createFakeRequest()
      const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

      // Act
      await sut.handle(request)

      // Assert
      expect(loadSpy).toHaveBeenCalledWith('any_token', Role.Admin)
    })

    it('should return 403 if user does not exist', async () => {
      // Arrange
      const { sut, loadAccountByTokenStub } = createSut()
      jest
        .spyOn(loadAccountByTokenStub, 'load')
        .mockResolvedValueOnce(undefined)
      const request = createFakeRequest()

      // Act
      const response = await sut.handle(request)

      // Assert
      expect(response).toEqual(forbidden(new AccessDeniedException()))
    })

    it('should return 200 with account id if token is valid and user exists', async () => {
      // Arrange
      const { sut } = createSut()
      const request = createFakeRequest()

      // Act
      const response = await sut.handle(request)

      // Assert
      const accountId = fakeAccount().id
      expect(response).toEqual(
        ok({
          accountId,
        })
      )
    })

    it('should return 500 if loadAccountByTokenUseCase throws', async () => {
      // Arrange
      const { sut, loadAccountByTokenStub } = createSut()
      jest
        .spyOn(loadAccountByTokenStub, 'load')
        .mockRejectedValueOnce(new Error())
      const request = createFakeRequest()

      // Act
      const response = await sut.handle(request)

      // Assert
      expect(response).toEqual(internalServerError(new Error()))
    })
  })
})

interface SutFactoryResponse {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByTokenUseCase
}

const createSut = (role: Role = Role.User): SutFactoryResponse => {
  const loadAccountByTokenStub = createLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)

  return {
    loadAccountByTokenStub,
    sut,
  }
}

const createLoadAccountByTokenStub = (): LoadAccountByTokenUseCase => {
  class LoadAccountByTokenStub implements LoadAccountByTokenUseCase {
    async load(): Promise<Optional<AccountModel>> {
      return fakeAccount()
    }
  }
  const loadAccountByTokenStub = new LoadAccountByTokenStub()
  return loadAccountByTokenStub
}

const createFakeRequest = (): AuthMiddleware.Request => ({
  accessToken: 'any_token',
})
