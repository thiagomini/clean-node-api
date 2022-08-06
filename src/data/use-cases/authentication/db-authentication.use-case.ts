import { Authentication, AuthenticationInput } from '../../../domain/use-cases/authentication'
import { Optional } from '../../../utils'
import { HashComparer, TokenGenerator } from '../../protocols/cryptography'
import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '../../protocols/db'
import { AuthenticationError } from './authentication.error'

export class DbAuthenticationUseCase implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

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
    if (account) {
      const passwordIsCorrect = await this.hashComparer.compare(password, account.password)
      if (passwordIsCorrect) {
        const token = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepository.update(account.id, token)
        return token
      }
    }
    return undefined
  }
}
