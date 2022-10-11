import { Decrypter, Encrypter } from '@/data/protocols/cryptography'
import jwt from 'jsonwebtoken'
import { EncryptionError } from './encryption.error'
import { InvalidTokenError } from '@/data/use-cases/account/load-account-by-token/errors'

export class JwtEcnrypterAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    try {
      return jwt.sign({ id: value }, this.secret)
    } catch (err) {
      throw new EncryptionError({
        sourceValue: value,
        cause: err as Error,
        context: {
          value,
        },
      })
    }
  }

  async decrypt(token: string): Promise<string> {
    try {
      return jwt.verify(token, this.secret) as string
    } catch (error) {
      throw new InvalidTokenError(token)
    }
  }
}
