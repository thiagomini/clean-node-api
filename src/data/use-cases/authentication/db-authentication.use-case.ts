import { Authentication, AuthenticationInput } from '../../../domain/use-cases/authentication'
import { Optional } from '../../../utils'
import { LoadAccountByEmailRepository } from '../../protocols'
import { AuthenticationError } from './authentication.error'

export class DbAuthenticationUseCase implements Authentication {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

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

  private async authenticateUser (authenticationInput: AuthenticationInput): Promise<Optional<string>> {
    await this.loadAccountByEmailRepository.load(authenticationInput.email)
    return undefined
  }
}
