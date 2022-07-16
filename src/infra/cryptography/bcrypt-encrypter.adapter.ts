import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols'

export class BCryptEncrypterAdapter implements Encrypter {
  public async encrypt (password: string): Promise<string> {
    await bcrypt.hash(password, 12)
    return ''
  }
}
