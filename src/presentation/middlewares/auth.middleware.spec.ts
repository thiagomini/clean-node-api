import { AccessDeniedException } from '../errors'
import { AuthMiddleware } from './auth.middleware'
import { HttpRequest } from '../protocols'
import { forbidden } from '../utils/http-responses-factories'
import { AccountModel } from '../../domain/models'

describe('AuthMiddleware', () => {
  describe('handle', () => {
    it('should return 403 if no x-access-token header is provided', async () => {
      class LoadAccountByTokenStub {
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
      const sut = new AuthMiddleware(loadAccountByTokenStub)
      const httpRequest: HttpRequest = {

      }
      const response = await sut.handle(httpRequest)

      expect(response).toEqual(forbidden(new AccessDeniedException()))
    })

    it('should call loadAccountByToken with correct accessToken', async () => {
      class LoadAccountByTokenStub {
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

      const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

      const sut = new AuthMiddleware(loadAccountByTokenStub)
      const httpRequest: HttpRequest = {
        headers: {
          'x-access-token': 'any_token'
        }
      }
      await sut.handle(httpRequest)

      expect(loadSpy).toHaveBeenCalledWith('any_token')
    })
  })
})
