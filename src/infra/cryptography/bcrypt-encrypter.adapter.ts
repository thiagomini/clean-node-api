import bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/cryptography'
import { EncryptionError } from './encryption.error'

export class BCryptEncrypterAdapter implements Hasher {
  public async hash (password: string): Promise<string> {
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
