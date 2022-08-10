import { Encrypter } from '../../data/protocols/cryptography'
import jwt from 'jsonwebtoken'

export class JwtEcnrypterAdapter implements Encrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secret)
  }
}
