import { AccountModel } from '../../../domain/models'
import { AddAccountInput } from '../../../domain/use-cases/add-account'
import { Hasher } from '../../protocols/cryptography'
import { AddAccountRepository } from '../../protocols/db/add-account.repository'
import { DbAddAccountUseCase } from './db-add-account.use-case'
import { AddAccountUseCaseError } from './errors'

describe('DbAddAccountUseCase', () => {
  it('should call Hasher with correct password', async () => {
    // Arrange
    const {
      sut,
      hasherStub: encrypterStub
    } = createSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'hash')
    const accountData = createDefaultAddAccountInput()

    // Act
    await sut.add(accountData)

    // Assert
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })

  it('should throw a AddAccountUseCaseError if the encrypter throws', async () => {
    // Arrange
    const {
      sut,
      hasherStub
    } = createSut()

    const innerError = new Error('EncrypterError')
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(async () => {
      throw innerError
    })

    const accountData = createDefaultAddAccountInput()

    // Act
    const addAccountPromise = sut.add(accountData)

    // Assert
    await expect(addAccountPromise).rejects.toThrow(AddAccountUseCaseError)
  })

  it('should call AddAccountRepository with correct values', async () => {
    // Arrange
    const {
      sut,
      repositoryStub
    } = createSut()
    const repositorySpy = jest.spyOn(repositoryStub, 'add')
    const accountData = createDefaultAddAccountInput()

    // Act
    await sut.add(accountData)

    // Assert
    expect(repositorySpy).toHaveBeenCalledWith({
      name: accountData.name,
      email: accountData.email,
      password: 'hashed_password'
    })
  })

  it('should throw a AddAccountUseCaseError if the repository throws', async () => {
    // Arrange
    const {
      sut,
      repositoryStub
    } = createSut()

    const innerError = new Error('RepositoryError')
    jest.spyOn(repositoryStub, 'add').mockImplementationOnce(async () => {
      throw innerError
    })

    const accountData = createDefaultAddAccountInput()

    // Act
    const addAccountPromise = sut.add(accountData)

    // Assert
    await expect(addAccountPromise).rejects.toThrowError(AddAccountUseCaseError)
  })

  it('should return the account fetched from the repository', async () => {
    // Arrange
    const {
      sut
    } = createSut()
    const accountData = createDefaultAddAccountInput()

    // Act
    const account = await sut.add(accountData)

    // Assert
    expect(account).toEqual(getDefaultSavedAccountData())
  })
})

interface SutFactoryResponse {
  sut: DbAddAccountUseCase
  hasherStub: Hasher
  repositoryStub: AddAccountRepository
}

const createSut = (): SutFactoryResponse => {
  const hasherStub = createHasher()
  const repositoryStub = createRepository()
  const sut = new DbAddAccountUseCase(hasherStub, repositoryStub)

  return {
    sut,
    hasherStub,
    repositoryStub
  }
}

const createHasher = (): Hasher => {
  class EncrypterStub implements Hasher {
    async hash (): Promise<string> {
      return 'hashed_password'
    }
  }
  return new EncrypterStub()
}

const createRepository = (): any => {
  class RepositoryStub implements AddAccountRepository {
    public async add (): Promise<AccountModel> {
      return getDefaultSavedAccountData()
    }
  }

  return new RepositoryStub()
}

const getDefaultSavedAccountData = (): AccountModel => ({
  id: 'valid_id',
  email: 'valid_email@mail.com',
  name: 'valid_name',
  password: 'hashed_password'
})

const createDefaultAddAccountInput = (): AddAccountInput => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})
