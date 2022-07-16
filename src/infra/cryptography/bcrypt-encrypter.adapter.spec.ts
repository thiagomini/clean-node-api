import bcrypt from 'bcrypt'
import { BCryptEncrypterAdapter } from './bcrypt-encrypter.adapter'

describe('BCryptEncrypterAdapter', () => {
  describe('encrypt', () => {
    it('should call bcrypt with correct value', async () => {
      const sut = new BCryptEncrypterAdapter()
      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.encrypt('any_value')

      expect(hashSpy).toHaveBeenCalledWith('any_value', expect.any(Number))
    })
  })
})
