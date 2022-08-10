import jwt from 'jsonwebtoken'
import { JwtEcnrypterAdapter } from './jwt-encrypter.adapter'

describe('JwtEcnrypterAdapter', () => {
  describe('encrypt', () => {
    it('should call jsonwebtoken.sign with correct values', async () => {
      const sut = new JwtEcnrypterAdapter('secret')
      const signSpy = jest.spyOn(jwt, 'sign')

      await sut.encrypt('any_id')

      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })
  })
})
