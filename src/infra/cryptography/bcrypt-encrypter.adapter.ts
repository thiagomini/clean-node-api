import bcrypt from 'bcrypt'
import { HashComparer, Hasher } from '../../data/protocols/cryptography'
import { HashingError } from './hashing.error'

export class BCryptEncrypterAdapter implements Hasher, HashComparer {
  public async hash (password: string): Promise<string> {
    try {
      const hashedValue = await bcrypt.hash(password, 12)
      return hashedValue
    } catch (err) {
      throw new HashingError({
        cause: err as Error,
        context: {
          password
        }
      })
    }
  }

  async compare (value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }
}
