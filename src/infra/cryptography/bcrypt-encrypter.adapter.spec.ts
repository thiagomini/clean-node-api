import bcrypt from 'bcrypt'
import { BCryptEncrypterAdapter } from './bcrypt-encrypter.adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'hased_value'
  }
}))

describe('BCryptEncrypterAdapter', () => {
  describe('encrypt', () => {
    it('should call bcrypt with correct value', async () => {
      const sut = new BCryptEncrypterAdapter()
      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.encrypt('any_value')

      expect(hashSpy).toHaveBeenCalledWith('any_value', expect.any(Number))
    })

    it('should return the hash returned by bcrypt', async () => {
      const sut = new BCryptEncrypterAdapter()

      const response = await sut.encrypt('any_value')

      expect(response).toBe('hased_value')
    })
  })
})
