import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/cryptography'
import { EncryptionError } from './encryption.error'

export class BCryptEncrypterAdapter implements Encrypter {
  public async encrypt (password: string): Promise<string> {
    try {
      const hashedValue = await bcrypt.hash(password, 12)
      return hashedValue
    } catch (err) {
      throw new EncryptionError({
        cause: err as Error,
        context: {
          password
        }
      })
    }
  }
}
