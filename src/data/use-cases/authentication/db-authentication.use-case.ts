import { Authentication, AuthenticationInput } from '../../../domain/use-cases/authentication'
import { Optional } from '../../../utils'
import { LoadAccountByEmailRepository } from '../../protocols'

export class DbAuthenticationUseCase implements Authentication {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  async authenticate (authenticationInput: AuthenticationInput): Promise<Optional<string>> {
    await this.loadAccountByEmailRepository.load(authenticationInput.email)
    return undefined
  }
}
