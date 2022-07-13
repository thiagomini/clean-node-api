import { AccountModel } from '../../../domain/models'
import { AddAccountInput } from '../../../domain/use-cases/add-account'
import { Encrypter } from '../../protocols'
import { AddAccountRepository } from '../../protocols/add-account.repository'
import { DbAddAccountUseCase } from './db-add-account.use-case'
import { AddAccountUseCaseError } from './errors'

describe('DbAddAccountUseCase', () => {
  it('should call Encrypter with correct password', async () => {
    // Arrange
    const {
      sut,
      encrypterStub
    } = createSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
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
      encrypterStub
    } = createSut()

    const innerError = new Error('EncrypterError')
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(async () => {
      throw innerError
    })

    const accountData = createDefaultAddAccountInput()

    // Act
    const addAccountPromise = sut.add(accountData)

    // Assert
    await expect(addAccountPromise).rejects.toThrow(new AddAccountUseCaseError({
      cause: innerError
    }))
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
    await expect(addAccountPromise).rejects.toThrow(new AddAccountUseCaseError({
      cause: innerError
    }))
  })
})

interface SutFactoryResponse {
  sut: DbAddAccountUseCase
  encrypterStub: Encrypter
  repositoryStub: AddAccountRepository
}

const createSut = (): SutFactoryResponse => {
  const encrypterStub = createEncrypter()
  const repositoryStub = createRepository()
  const sut = new DbAddAccountUseCase(encrypterStub, repositoryStub)

  return {
    sut,
    encrypterStub,
    repositoryStub
  }
}

const createEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (password: string): Promise<string> {
      return 'hashed_password'
    }
  }
  return new EncrypterStub()
}

const createRepository = (): any => {
  class RepositoryStub implements AddAccountRepository {
    public async add (account: AddAccountInput): Promise<AccountModel> {
      return {
        id: '1',
        email: 'any_email@mail.com',
        name: 'Test Account',
        password: 'any_password'
      }
    }
  }

  return new RepositoryStub()
}

const createDefaultAddAccountInput = (): AddAccountInput => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})
