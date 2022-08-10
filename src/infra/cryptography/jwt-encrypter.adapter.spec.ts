import jwt from 'jsonwebtoken'
import { JwtEcnrypterAdapter } from './jwt-encrypter.adapter'

jest.mock('jsonwebtoken', () => ({
  sign: (): string => 'encrypted_id'
}))

describe('JwtEcnrypterAdapter', () => {
  describe('encrypt', () => {
    it('should call jsonwebtoken.sign with correct values', async () => {
      const sut = new JwtEcnrypterAdapter('secret')
      const signSpy = jest.spyOn(jwt, 'sign')

      await sut.encrypt('any_id')

      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    it('should return encrypted_id on sign success', async () => {
      const sut = new JwtEcnrypterAdapter('secret')

      const accessToken = await sut.encrypt('any_id')

      expect(accessToken).toBe('encrypted_id')
    })
  })
})
