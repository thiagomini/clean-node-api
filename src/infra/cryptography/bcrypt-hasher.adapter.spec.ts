import bcrypt from 'bcrypt'
import { BCryptHasherAdapter } from './bcrypt-hasher.adapter'
import { HashComparisonError } from './hash-comparison.error'
import { HashingError } from './hashing.error'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hased_value'
  },

  async compare(): Promise<boolean> {
    return true
  },
}))

describe('BCryptHasherAdapter', () => {
  describe('encrypt', () => {
    it('should call bcrypt.hash with correct value', async () => {
      const sut = new BCryptHasherAdapter()
      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.hash('any_value')

      expect(hashSpy).toHaveBeenCalledWith('any_value', expect.any(Number))
    })

    it('should return the hash returned by bcrypt', async () => {
      const sut = new BCryptHasherAdapter()

      const response = await sut.hash('any_value')

      expect(response).toBe('hased_value')
    })

    it('should throw an HashingError if bcrypt throws', async () => {
      const sut = new BCryptHasherAdapter()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw new Error()
      })

      const responsePromise = sut.hash('any_value')

      await expect(responsePromise).rejects.toThrowError(HashingError)
    })
  })

  describe('compare', () => {
    it('should call bcrypt.compare with correct values', async () => {
      const sut = new BCryptHasherAdapter()
      const compareSpy = jest.spyOn(bcrypt, 'compare')

      await sut.compare('value', 'hash')

      expect(compareSpy).toHaveBeenCalledWith('value', 'hash')
    })

    it('should return false when bcrypt.compare returns false', async () => {
      // Arrange
      const sut = new BCryptHasherAdapter()
      const originalCompare = bcrypt.compare
      bcrypt.compare = async () => false

      // Act
      const response = await sut.compare('value', 'hash')

      // Assert
      expect(response).toBe(false)
      bcrypt.compare = originalCompare
    })

    it('should return true when bcrypt.compare returns true', async () => {
      const sut = new BCryptHasherAdapter()

      const response = await sut.compare('value', 'hash')

      expect(response).toBe(true)
    })

    it('should throw an HashComparisonError if bcrypt.compare throws', async () => {
      const sut = new BCryptHasherAdapter()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
        throw new Error()
      })

      const responsePromise = sut.compare('value', 'hash')

      await expect(responsePromise).rejects.toThrowError(HashComparisonError)
    })
  })
})
