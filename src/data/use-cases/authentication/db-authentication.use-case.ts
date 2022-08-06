import { Authentication, AuthenticationInput } from '../../../domain/use-cases/authentication'
import { Optional } from '../../../utils'
import { HashComparer } from '../../protocols/cryptography'
import { LoadAccountByEmailRepository } from '../../protocols/db'
import { AuthenticationError } from './authentication.error'

export class DbAuthenticationUseCase implements Authentication {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository, private readonly hashComparer: HashComparer) {}

  async authenticate (authenticationInput: AuthenticationInput): Promise<Optional<string>> {
    try {
      return await this.authenticateUser(authenticationInput)
    } catch (err) {
      throw new AuthenticationError({
        email: authenticationInput.email,
        cause: err as Error,
        context: {
          email: authenticationInput.email
        }
      })
    }
  }

  private async authenticateUser ({ email, password }: AuthenticationInput): Promise<Optional<string>> {
    const account = await this.loadAccountByEmailRepository.load(email)
    this.hashComparer.compare(password, account?.password ?? '')
    return undefined
  }
}
