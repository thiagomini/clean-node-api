import { DbLoadAccountByTokenUseCase } from './db-load-account-by-token.use-case'
import {
  AccountModel,
  Decrypter,
  LoadAccountByTokenRepository,
  AccountByTokenNotFoundError,
  InvalidTokenError,
  LoadAccountByTokenUseCaseError,
} from './db-load-account-by-token.protocols'
import { Role } from '@/auth'
import { fakeAccount } from '@/domain/test'
import { createDecrypterStub } from '@/data/test'

const TOKEN = 'any_token'
const ROLE = Role.User

describe('DbLoadAccountByTokenUseCase', () => {
  it('should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = createSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.load(TOKEN)

    expect(decryptSpy).toHaveBeenCalledWith(TOKEN)
  })

  it('should throw a LoadAccountByTokenUseCaseError when Decrypter throws', async () => {
    const { sut, decrypterStub } = createSut()
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())

    const loadPromise = sut.load(TOKEN)

    await expect(loadPromise).rejects.toThrowError(
      LoadAccountByTokenUseCaseError
    )
  })

  it('should return undefined when accessToken is invalid', async () => {
    const { sut, decrypterStub } = createSut()

    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockRejectedValueOnce(new InvalidTokenError(TOKEN))

    const response = await sut.load(TOKEN)

    expect(response).toBeUndefined()
  })

  it('should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = createSut()
    const loadSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')

    await sut.load(TOKEN, ROLE)

    expect(loadSpy).toHaveBeenCalledWith(TOKEN, ROLE)
  })

  it('should throw a LoadAccountByTokenUseCaseError when DbLoadAccountByTokenUseCase throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = createSut()
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockRejectedValueOnce(new Error())

    const loadPromise = sut.load(TOKEN)

    await expect(loadPromise).rejects.toThrowError(
      LoadAccountByTokenUseCaseError
    )
  })

  it('should return undefined when account does not exist', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = createSut()
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockRejectedValueOnce(new AccountByTokenNotFoundError(TOKEN))

    const response = await sut.load(TOKEN)

    expect(response).toBeUndefined()
  })

  it('should return an accont on success', async () => {
    const { sut } = createSut()

    const response = await sut.load(TOKEN)

    expect(response).toEqual(fakeAccount())
  })
})

type SutFactoryResponse = {
  sut: DbLoadAccountByTokenUseCase
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const createSut = (): SutFactoryResponse => {
  const decrypterStub = createDecrypterStub(TOKEN)
  const loadAccountByTokenRepositoryStub =
    createLoadAccountByTokenRepositoryStub()
  const sut = new DbLoadAccountByTokenUseCase(
    decrypterStub,
    loadAccountByTokenRepositoryStub
  )

  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  }
}

const createLoadAccountByTokenRepositoryStub =
  (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub
      implements LoadAccountByTokenRepository
    {
      public async loadByToken(): Promise<AccountModel> {
        return fakeAccount()
      }
    }
    const repositoryStub = new LoadAccountByTokenRepositoryStub()
    return repositoryStub
  }
