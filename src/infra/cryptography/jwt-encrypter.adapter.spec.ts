import jwt from 'jsonwebtoken'
import { EncryptionError } from './encryption.error'
import { JwtEcnrypterAdapter } from './jwt-encrypter.adapter'

const TOKEN = 'any_token'
const DECRYPTED_ID = 'decrypted_id'

jest.mock('jsonwebtoken', () => ({
  sign: (): string => 'encrypted_id',
  verify: (): string => DECRYPTED_ID,
}))

describe('JwtEcnrypterAdapter', () => {
  describe('encrypt', () => {
    it('should call jwt.sign with correct values', async () => {
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

    it('should throw an EncryptionError if jwt.sign throws an error', async () => {
      const sut = new JwtEcnrypterAdapter('secret')
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })

      const encryptPromise = sut.encrypt('any_id')

      await expect(encryptPromise).rejects.toThrowError(EncryptionError)
    })
  })

  describe('decrypt', () => {
    it('should call jwt.verify with correct values', async () => {
      const sut = new JwtEcnrypterAdapter('secret')
      const signSpy = jest.spyOn(jwt, 'verify')

      await sut.decrypt(TOKEN)

      expect(signSpy).toHaveBeenCalledWith(TOKEN, 'secret')
    })
  })
})
