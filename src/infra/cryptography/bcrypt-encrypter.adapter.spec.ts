import bcrypt from 'bcrypt'
import { BCryptEncrypterAdapter } from './bcrypt-encrypter.adapter'
import { EncryptionError } from './encryption.error'

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

    it('should throw an EncryptionError if bcrypt throws', async () => {
      const sut = new BCryptEncrypterAdapter()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw new Error()
      })

      const responsePromise = sut.encrypt('any_value')

      await expect(responsePromise).rejects.toThrowError(EncryptionError)
    })
  })
})
