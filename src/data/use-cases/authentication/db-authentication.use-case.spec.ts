import { AccountModel } from '../../../domain/models'
import { AuthenticationInput } from '../../../domain/use-cases/authentication'
import { HashComparer, TokenGenerator } from '../../protocols/cryptography'
import { LoadAccountByEmailRepository } from '../../protocols/db'
import { AuthenticationError } from './authentication.error'
import { DbAuthenticationUseCase } from './db-authentication.use-case'

describe('DbAuthenticationUseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = createSut()
    const loadAccountByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

    await sut.authenticate(createFakeAuthenticationInput())

    expect(loadAccountByEmailSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })

  it('should throw AuthenticationError if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = createSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockRejectedValueOnce(new Error())

    const authenticatePromise = sut.authenticate(createFakeAuthenticationInput())

    await expect(authenticatePromise).rejects.toThrowError(AuthenticationError)
  })

  it('should return undefined if user does not exist', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = createSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockResolvedValueOnce(undefined)

    const response = await sut.authenticate(createFakeAuthenticationInput())

    expect(response).toBeUndefined()
  })

  it('should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = createSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')

    await sut.authenticate(createFakeAuthenticationInput())

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  it('should throw AuthenticationError if HashComparer throws', async () => {
    const { sut, hashComparerStub } = createSut()
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())

    const authenticatePromise = sut.authenticate(createFakeAuthenticationInput())

    await expect(authenticatePromise).rejects.toThrowError(AuthenticationError)
  })

  it('should return undefined if password comparison fails', async () => {
    const { sut, hashComparerStub } = createSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)

    const response = await sut.authenticate(createFakeAuthenticationInput())

    expect(response).toBeUndefined()
  })

  it('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = createSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')

    await sut.authenticate(createFakeAuthenticationInput())

    expect(generateSpy).toHaveBeenCalledWith('valid_id')
  })

  it('should throw AuthenticationError if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = createSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockRejectedValueOnce(new Error())

    const authenticatePromise = sut.authenticate(createFakeAuthenticationInput())

    await expect(authenticatePromise).rejects.toThrowError(AuthenticationError)
  })
})

interface SutFactoryResponse {
  sut: DbAuthenticationUseCase
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
}

const createSut = (): SutFactoryResponse => {
  const loadAccountByEmailRepositoryStub = createLoadAccountByEmailRepoStub()
  const hashComparerStub = createHashComparerStub()
  const tokenGeneratorStub = createTokenGeneratorStub()
  const sut = new DbAuthenticationUseCase(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub
  }
}

const createLoadAccountByEmailRepoStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    public async load (): Promise<AccountModel> {
      return getFakeAccount()
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const getFakeAccount = (): AccountModel => ({
  email: 'any_email@mail.com',
  id: 'valid_id',
  name: 'any_name',
  password: 'hashed_password'
})

const createHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (): Promise<boolean> {
      return true
    }
  }

  return new HashComparerStub()
}

const createTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (): Promise<string> {
      return 'token'
    }
  }

  return new TokenGeneratorStub()
}

const createFakeAuthenticationInput = (): AuthenticationInput => ({
  email: 'any_mail@mail.com',
  password: 'any_password'
})
