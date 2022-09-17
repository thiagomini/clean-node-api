import { AccountModel } from '../../../domain/models'
import { Decrypter } from '../../protocols/cryptography'
import { DbLoadAccountByTokenUseCase } from './db-load-account-by-token.use-case'
import { LoadAccountByTokenUseCaseError } from './load-account-by-token.use-case.error'
import { LoadAccountByTokenRepository } from '../../protocols/db/account-repository'

const TOKEN = 'any_token'

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

  it('should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = createSut()
    const loadSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'load')

    await sut.load(TOKEN)

    expect(loadSpy).toHaveBeenCalledWith(TOKEN)
  })
})

interface SutFactoryResponse {
  sut: DbLoadAccountByTokenUseCase
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const createSut = (): SutFactoryResponse => {
  const decrypterStub = createDecrypterStub()
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

const createDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    public async decrypt(): Promise<string> {
      return TOKEN
    }
  }
  const decrypterStub = new DecrypterStub()
  return decrypterStub
}

const createLoadAccountByTokenRepositoryStub =
  (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub
      implements LoadAccountByTokenRepository
    {
      public async load(): Promise<AccountModel> {
        return accountModel()
      }
    }
    const repositoryStub = new LoadAccountByTokenRepositoryStub()
    return repositoryStub
  }

const accountModel = (): AccountModel => ({
  id: 'valid_id',
  email: 'any_email@mail.com',
  name: 'any_name',
  accessToken: TOKEN,
  password: 'any_hashed_password',
})
