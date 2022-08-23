import { AccountModel } from '../../../domain/models'
import { AddAccountInput, AddAccountOutput } from '../../../domain/use-cases/add-account'
import { Optional } from '../../../utils'
import { Hasher } from '../../protocols/cryptography'
import { LoadAccountByEmailRepository } from '../../protocols/db/account-repository'
import { AddAccountRepository } from '../../protocols/db/account-repository/add-account.repository'
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
    await sut.findOrCreate(accountData)

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
    const addAccountPromise = sut.findOrCreate(accountData)

    // Assert
    await expect(addAccountPromise).rejects.toThrow(AddAccountUseCaseError)
  })

  it('should call AddAccountRepository with correct values', async () => {
    // Arrange
    const {
      sut,
      addAccountRepository
    } = createSut()
    const repositorySpy = jest.spyOn(addAccountRepository, 'add')
    const accountData = createDefaultAddAccountInput()

    // Act
    await sut.findOrCreate(accountData)

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
      addAccountRepository
    } = createSut()

    const innerError = new Error('RepositoryError')
    jest.spyOn(addAccountRepository, 'add').mockImplementationOnce(async () => {
      throw innerError
    })

    const accountData = createDefaultAddAccountInput()

    // Act
    const addAccountPromise = sut.findOrCreate(accountData)

    // Assert
    await expect(addAccountPromise).rejects.toThrowError(AddAccountUseCaseError)
  })

  it('should create a new account if it did not exist', async () => {
    // Arrange
    const {
      sut
    } = createSut()
    const accountData = createDefaultAddAccountInput()

    // Act
    const account = await sut.findOrCreate(accountData)

    // Assert
    expect(account).toEqual(getDefaultSavedAccountData())
  })
})

interface SutFactoryResponse {
  sut: DbAddAccountUseCase
  hasherStub: Hasher
  addAccountRepository: AddAccountRepository
  loadAccountByEmailRepository: LoadAccountByEmailRepository
}

const createSut = (): SutFactoryResponse => {
  const hasherStub = createHasherStub()
  const addAccountRepository = createAddAccountRepositoryStub()
  const loadAccountByEmailRepository = createLoadAccountByEmailRepositoryStub()
  const sut = new DbAddAccountUseCase(hasherStub, addAccountRepository, loadAccountByEmailRepository)

  return {
    sut,
    hasherStub,
    addAccountRepository,
    loadAccountByEmailRepository
  }
}

const createHasherStub = (): Hasher => {
  class EncrypterStub implements Hasher {
    async hash (): Promise<string> {
      return 'hashed_password'
    }
  }
  return new EncrypterStub()
}

const createAddAccountRepositoryStub = (): any => {
  class RepositoryStub implements AddAccountRepository {
    public async add (): Promise<AccountModel> {
      return getDefaultSavedAccountData()
    }
  }

  return new RepositoryStub()
}

const createLoadAccountByEmailRepositoryStub = (): any => {
  class RepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(): Promise<Optional<AccountModel>> {
      return getDefaultSavedAccountData()
    }
  }

  return new RepositoryStub()
}

const getDefaultSavedAccountData = (): AddAccountOutput => ({
  id: 'valid_id',
  email: 'valid_email@mail.com',
  name: 'valid_name',
  password: 'hashed_password',
  isNew: true
})

const createDefaultAddAccountInput = (): AddAccountInput => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})
