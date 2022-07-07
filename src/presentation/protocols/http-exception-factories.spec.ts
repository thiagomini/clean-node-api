import { badRequest } from './http-exception-factories'
import { HttpStatusCodes } from './http-status-codes'

describe('http exception factories', () => {
  describe('badRequest', () => {
    it('should return an object with BAD_REQUEST as statusCode and given error as the body', () => {
      const error = new Error('Something went wrong!')
      const badRequestResponse = badRequest(error)

      expect(badRequestResponse.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
      expect(badRequestResponse.body).toBe(error)
    })
  })
})
