import { ServerError, UnauthorizedError } from '@/presentation/errors'
import {
  badRequest,
  forbidden,
  internalServerError,
  noContent,
  notFound,
  ok,
  unauthorized,
} from '@/presentation/utils/http-responses-factories'
import { HttpStatusCodes } from '@/presentation/protocols/http-status-codes.enum'
import { NotFoundError } from '@/presentation/errors/not-found.error'

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

      expect(badRequestResponse.statusCode).toBe(
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
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

  describe('forbidden', () => {
    it('should return an object with FORBIDDEN as statusCode and given error as the body', () => {
      const error = new Error('Something went wrong!')
      const badRequestResponse = forbidden(error)

      expect(badRequestResponse.statusCode).toBe(HttpStatusCodes.FORBIDDEN)
      expect(badRequestResponse.body).toBe(error)
    })
  })

  describe('noContent', () => {
    it('should return an object with NO_CONTENT as statusCode and null body', () => {
      const badRequestResponse = noContent()

      expect(badRequestResponse.statusCode).toBe(HttpStatusCodes.NO_CONTENT)
      expect(badRequestResponse.body).toBe(null)
    })
  })

  describe('notFound', () => {
    it('should return an object with NOT_FOUND as statusCode and NotFoundError as body', () => {
      const notFoundRequestResponse = notFound({
        entityName: 'SomeEntity',
        missingId: 'id',
        cause: new Error(),
      })

      expect(notFoundRequestResponse.statusCode).toBe(HttpStatusCodes.NOT_FOUND)
      expect(notFoundRequestResponse.body).toEqual(
        new NotFoundError({
          entityName: 'SomeEntity',
          missingId: 'id',
          cause: new Error(),
        })
      )
    })
  })
})
