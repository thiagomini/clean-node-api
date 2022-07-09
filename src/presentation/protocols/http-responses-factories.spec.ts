import { ServerError } from '../errors'
import { badRequest, internalServerError } from './http-responses-factories'
import { HttpStatusCodes } from './http-status-codes'

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
})
