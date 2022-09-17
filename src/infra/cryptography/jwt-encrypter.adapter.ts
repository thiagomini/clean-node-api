import { Encrypter } from '../../data/protocols/cryptography'
import jwt from 'jsonwebtoken'
import { EncryptionError } from './encryption.error'

export class JwtEcnrypterAdapter implements Encrypter {
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
}
