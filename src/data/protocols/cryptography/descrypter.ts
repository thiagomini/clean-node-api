import { Optional } from '../../../utils'

export interface Decrypter {
  decrypt(token: string): Promise<Optional<string>>
}
