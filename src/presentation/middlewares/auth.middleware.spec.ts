import { AccessDeniedException } from '../errors'
import { AuthMiddleware } from './auth.middleware'
import { HttpRequest } from '../protocols'
import { forbidden } from '../utils/http-responses-factories'
describe('AuthMiddleware', () => {
  describe('handle', () => {
    it('should return 403 if no x-access-token header is provided', async () => {
      const sut = new AuthMiddleware()
      const httpRequest: HttpRequest = {

      }
      const response = await sut.handle(httpRequest)

      expect(response).toEqual(forbidden(new AccessDeniedException()))
    })
  })
})
