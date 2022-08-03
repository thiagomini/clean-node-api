import { Authentication, AuthenticationInput } from '../../../domain/use-cases/authentication'
import { Optional } from '../../../utils'
import { LoadAccountByEmailRepository } from '../../protocols'
import { AuthenticationError } from './authentication.error'

export class DbAuthenticationUseCase implements Authentication {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  async authenticate (authenticationInput: AuthenticationInput): Promise<Optional<string>> {
    try {
      await this.loadAccountByEmailRepository.load(authenticationInput.email)
      return undefined
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
}
