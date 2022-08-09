import bcrypt from 'bcrypt'
import { HashComparer, Hasher } from '../../data/protocols/cryptography'
import { EncryptionError } from './encryption.error'

export class BCryptEncrypterAdapter implements Hasher, HashComparer {
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

  async compare (value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash)
    return true
  }
}
