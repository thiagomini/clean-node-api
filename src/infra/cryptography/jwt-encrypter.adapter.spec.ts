import jwt from 'jsonwebtoken'
import { EncryptionError } from './encryption.error'
import { JwtEcnrypterAdapter } from './jwt-encrypter.adapter'
import { InvalidTokenError } from '../../data/use-cases/load-account-by-token/errors'

const TOKEN = 'any_token'
const ENCRYPTED_TOKEN = 'encrypted_id'
const DECRYPTED_TOKEN = 'decrypted_id'

jest.mock('jsonwebtoken', () => ({
  sign: (): string => ENCRYPTED_TOKEN,
  verify: (): string => DECRYPTED_TOKEN,
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

      expect(accessToken).toBe(ENCRYPTED_TOKEN)
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

    it('should throw InvalidTokenError when jwt.verify throws', async () => {
      const sut = new JwtEcnrypterAdapter('secret')
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })

      const decryptPromise = sut.decrypt(TOKEN)

      await expect(decryptPromise).rejects.toThrowError(InvalidTokenError)
    })

    it('should return decrypted token on success', async () => {
      const sut = new JwtEcnrypterAdapter('secret')

      const response = await sut.decrypt(TOKEN)

      expect(response).toBe(DECRYPTED_TOKEN)
    })
  })
})
