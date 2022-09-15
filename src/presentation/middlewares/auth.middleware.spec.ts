import { Optional } from '../../utils'
import { AuthMiddleware } from './auth.middleware'
import {
  AccessDeniedException, forbidden,
  HttpRequest,
  internalServerError,
  LoadAccountByTokenUseCase,
  ok,
  AccountModel
} from './auth.middleware.protocols'

describe('AuthMiddleware', () => {
  describe('handle', () => {
    it('should return 403 if no x-access-token header is provided', async () => {
      // Arrange
      const { sut } = createSut()
      const httpRequest: HttpRequest = { }

      // Act
      const response = await sut.handle(httpRequest)

      // Assert
      expect(response).toEqual(forbidden(new AccessDeniedException()))
    })

    it('should call loadAccountByToken with correct values', async () => {
      // Arrange
      const { sut, loadAccountByTokenStub } = createSut('any_role')
      const httpRequest = createFakeRequest()
      const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

      // Act
      await sut.handle(httpRequest)

      // Assert
      expect(loadSpy).toHaveBeenCalledWith('any_token', 'any_role')
    })

    it('should return 403 if user does not exist', async () => {
      // Arrange
      const { sut, loadAccountByTokenStub } = createSut()
      jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(undefined)
      const httpRequest = createFakeRequest()

      // Act
      const response = await sut.handle(httpRequest)

      // Assert
      expect(response).toEqual(forbidden(new AccessDeniedException()))
    })

    it('should return 200 with account id if token is valid and user exists', async () => {
      // Arrange
      const { sut } = createSut()
      const httpRequest = createFakeRequest()

      // Act
      const response = await sut.handle(httpRequest)

      // Assert
      const accountId = getAccountModel().id
      expect(response).toEqual(ok({
        accountId
      }))
    })

    it('should return 500 if loadAccountByTokenUseCase throws', async () => {
      // Arrange
      const { sut, loadAccountByTokenStub } = createSut()
      jest.spyOn(loadAccountByTokenStub, 'load').mockRejectedValueOnce(new Error())
      const httpRequest = createFakeRequest()

      // Act
      const response = await sut.handle(httpRequest)

      // Assert
      expect(response).toEqual(internalServerError(new Error()))
    })
  })
})

interface SutFactoryResponse {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByTokenUseCase
}

const createSut = (role = 'user'): SutFactoryResponse => {
  const loadAccountByTokenStub = createLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)

  return {
    loadAccountByTokenStub,
    sut
  }
}

const createLoadAccountByTokenStub = (): LoadAccountByTokenUseCase => {
  class LoadAccountByTokenStub implements LoadAccountByTokenUseCase {
    async load (): Promise<Optional<AccountModel>> {
      return getAccountModel()
    }
  }
  const loadAccountByTokenStub = new LoadAccountByTokenStub()
  return loadAccountByTokenStub
}

const getAccountModel = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email',
  name: 'any_name',
  password: 'any_password',
  accessToken: 'any_access_token'
})

const createFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})
