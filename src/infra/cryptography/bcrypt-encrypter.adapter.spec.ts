import bcrypt from 'bcrypt'
import { BCryptEncrypterAdapter } from './bcrypt-encrypter.adapter'
import { EncryptionError } from './encryption.error'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'hased_value'
  },

  async compare (): Promise<boolean> {
    return true
  }
}))

describe('BCryptEncrypterAdapter', () => {
  describe('encrypt', () => {
    it('should call bcrypt.hash with correct value', async () => {
      const sut = new BCryptEncrypterAdapter()
      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.hash('any_value')

      expect(hashSpy).toHaveBeenCalledWith('any_value', expect.any(Number))
    })

    it('should return the hash returned by bcrypt', async () => {
      const sut = new BCryptEncrypterAdapter()

      const response = await sut.hash('any_value')

      expect(response).toBe('hased_value')
    })

    it('should throw an EncryptionError if bcrypt throws', async () => {
      const sut = new BCryptEncrypterAdapter()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw new Error()
      })

      const responsePromise = sut.hash('any_value')

      await expect(responsePromise).rejects.toThrowError(EncryptionError)
    })
  })

  describe('compare', () => {
    it('should call bcrypt.compare with correct values', async () => {
      const sut = new BCryptEncrypterAdapter()
      const compareSpy = jest.spyOn(bcrypt, 'compare')

      await sut.compare('value', 'hash')

      expect(compareSpy).toHaveBeenCalledWith('value', 'hash')
    })

    it('should return false when bcrypt.hash returns false', async () => {
      // Arrange
      const sut = new BCryptEncrypterAdapter()
      const originalCompare = bcrypt.compare
      bcrypt.compare = async () => false

      // Act
      const response = await sut.compare('value', 'hash')

      // Assert
      expect(response).toBe(false)
      bcrypt.compare = originalCompare
    })

    it('should return true when bcrypt.hash returns true', async () => {
      const sut = new BCryptEncrypterAdapter()

      const response = await sut.compare('value', 'hash')

      expect(response).toBe(true)
    })
  })
})
