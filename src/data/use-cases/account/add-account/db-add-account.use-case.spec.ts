import { createAddAccountRepositoryStub, createHasherStub } from '@/data/test'
import {
  fakeAccount,
  fakeAccountInput,
  fakeAddAccountOutput,
} from '@/domain/test'
import {
  AddAccountOutput,
  AddAccountRepository,
  AddAccountUseCaseError,
  Hasher,
  LoadAccountByEmailRepository,
} from './db-add-account.protocols'

import { createLoadAccountByEmailRepositoryStub } from '@/data/test'
import { DbAddAccountUseCase } from './db-add-account.use-case'

describe('DbAddAccountUseCase', () => {
  it('should call Hasher with correct password', async () => {
    // Arrange
    const { sut, hasherStub: encrypterStub } = createSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'hash')
    const accountData = fakeAccountInput()

    // Act
    await sut.findOrCreate(accountData)

    // Assert
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })

  it('should throw a AddAccountUseCaseError if the encrypter throws', async () => {
    // Arrange
    const { sut, hasherStub } = createSut()

    const innerError = new Error('EncrypterError')
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(async () => {
      throw innerError
    })

    const accountData = fakeAccountInput()

    // Act
    const addAccountPromise = sut.findOrCreate(accountData)

    // Assert
    await expect(addAccountPromise).rejects.toThrow(AddAccountUseCaseError)
  })

  it('should call AddAccountRepository with correct values', async () => {
    // Arrange
    const { sut, addAccountRepository } = createSut()
    const repositorySpy = jest.spyOn(addAccountRepository, 'add')
    const accountData = fakeAccountInput()

    // Act
    await sut.findOrCreate(accountData)

    // Assert
    expect(repositorySpy).toHaveBeenCalledWith({
      name: accountData.name,
      email: accountData.email,
      password: 'hashed_password',
    })
  })

  it('should throw a AddAccountUseCaseError if the repository throws', async () => {
    // Arrange
    const { sut, addAccountRepository } = createSut()

    const innerError = new Error('RepositoryError')
    jest.spyOn(addAccountRepository, 'add').mockImplementationOnce(async () => {
      throw innerError
    })

    const accountData = fakeAccountInput()

    // Act
    const addAccountPromise = sut.findOrCreate(accountData)

    // Assert
    await expect(addAccountPromise).rejects.toThrowError(AddAccountUseCaseError)
  })

  it('should create a new account if it did not exist', async () => {
    // Arrange
    const { sut } = createSut()
    const accountData = fakeAccountInput()

    // Act
    const account = await sut.findOrCreate(accountData)

    // Assert
    expect(account).toEqual(fakeAddAccountOutput())
  })

  it('should return an existing account if it exists', async () => {
    // Arrange
    const { sut, loadAccountByEmailRepository } = createSut()
    const existingAccount = fakeAccount()
    jest
      .spyOn(loadAccountByEmailRepository, 'loadByEmail')
      .mockResolvedValueOnce(existingAccount)
    const accountData = fakeAccountInput()

    // Act
    const account = await sut.findOrCreate(accountData)

    // Assert
    expect(account).toEqual<AddAccountOutput>({
      ...existingAccount,
      isNew: false,
    })
  })
})

type SutFactoryResponse = {
  sut: DbAddAccountUseCase
  hasherStub: Hasher
  addAccountRepository: AddAccountRepository
  loadAccountByEmailRepository: LoadAccountByEmailRepository
}

const createSut = (): SutFactoryResponse => {
  const hasherStub = createHasherStub()
  const addAccountRepository = createAddAccountRepositoryStub()
  const loadAccountByEmailRepository = createLoadAccountByEmailRepositoryStub()
  const sut = new DbAddAccountUseCase(
    hasherStub,
    addAccountRepository,
    loadAccountByEmailRepository
  )

  return {
    sut,
    hasherStub,
    addAccountRepository,
    loadAccountByEmailRepository,
  }
}
