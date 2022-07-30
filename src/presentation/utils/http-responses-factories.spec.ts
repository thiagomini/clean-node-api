import { ServerError, UnauthorizedError } from '../errors'
import { badRequest, internalServerError, ok, unauthorized } from './http-responses-factories'
import { HttpStatusCodes } from '../protocols/http-status-codes'

describe('http responses factories', () => {
  describe('badRequest', () => {
    it('should return an object with BAD_REQUEST as statusCode and given error as the body', () => {
      const error = new Error('Something went wrong!')
      const badRequestResponse = badRequest(error)

      expect(badRequestResponse.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
      expect(badRequestResponse.body).toBe(error)
    })
  })

  describe('internalServerError', () => {
    it('should return an object with INTERNAL_SERVER_ERROR as statusCode and ServerError error as the body', () => {
      const error = new Error('Something went wrong!')
      const badRequestResponse = internalServerError(error)

      expect(badRequestResponse.statusCode).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      expect(badRequestResponse.body).toEqual(new ServerError(error))
    })
  })

  describe('ok', () => {
    it('should return an object with OK as statusCode and given object as body', () => {
      const body = { key: 'value' }
      const badRequestResponse = ok(body)

      expect(badRequestResponse.statusCode).toBe(HttpStatusCodes.OK)
      expect(badRequestResponse.body).toEqual(body)
    })
  })

  describe('unauthorized', () => {
    it('should return an object with UNAUTHORIZED as statusCode and UnauthorizedError as body', () => {
      const badRequestResponse = unauthorized()

      expect(badRequestResponse.statusCode).toBe(HttpStatusCodes.UNAUTHORIZED)
      expect(badRequestResponse.body).toEqual(new UnauthorizedError())
    })
  })
})
