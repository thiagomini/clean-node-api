import {
  Authentication,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  AuthenticationInput,
  Optional,
  HashComparer,
  Encrypter,
  AuthenticationError,
} from './db-authentication-protocols'

export class DbAuthenticationUseCase implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async authenticate(
    authenticationInput: AuthenticationInput
  ): Promise<Optional<string>> {
    try {
      return await this.authenticateUser(authenticationInput)
    } catch (err) {
      throw new AuthenticationError({
        email: authenticationInput.email,
        cause: err as Error,
        context: {
          email: authenticationInput.email,
        },
      })
    }
  }

  private async authenticateUser({
    email,
    password,
  }: AuthenticationInput): Promise<Optional<string>> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!account) {
      return undefined
    }

    const passwordIsCorrect = await this.hashComparer.compare(
      password,
      account.password
    )
    if (!passwordIsCorrect) {
      return undefined
    }

    const token = await this.encrypter.encrypt(account.id)
    await this.updateAccessTokenRepository.updateAccessToken(account.id, token)
    return token
  }
}
