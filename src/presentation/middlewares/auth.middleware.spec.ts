import { AccessDeniedException } from '../errors'
import { AuthMiddleware } from './auth.middleware'
import { HttpRequest } from '../protocols'
import { forbidden } from '../utils/http-responses-factories'
import { AccountModel } from '../../domain/models'
import { LoadAccountByTokenUseCase } from '../../domain/use-cases/authentication'

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

    it('should call loadAccountByToken with correct accessToken', async () => {
      // Arrange
      const { sut, loadAccountByTokenStub } = createSut()
      const httpRequest: HttpRequest = {
        headers: {
          'x-access-token': 'any_token'
        }
      }
      const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

      // Act
      await sut.handle(httpRequest)

      // Assert
      expect(loadSpy).toHaveBeenCalledWith('any_token')
    })
  })
})

interface SutFactoryResponse {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByTokenUseCase
}

const createSut = (): SutFactoryResponse => {
  const loadAccountByTokenStub = createLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub)

  return {
    loadAccountByTokenStub,
    sut
  }
}

const createLoadAccountByTokenStub = (): LoadAccountByTokenUseCase => {
  class LoadAccountByTokenStub implements LoadAccountByTokenUseCase {
    async load (): Promise<AccountModel> {
      return {
        id: 'any_id',
        email: 'any_email',
        name: 'any_name',
        password: 'any_password',
        accessToken: 'any_access_token'
      }
    }
  }
  const loadAccountByTokenStub = new LoadAccountByTokenStub()
  return loadAccountByTokenStub
}
