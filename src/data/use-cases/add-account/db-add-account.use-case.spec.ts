import { AddAccountInput } from '../../../domain/use-cases/add-account'
import { Encrypter } from '../../protocols'
import { DbAddAccountUseCase } from './db-add-account.use-case'
import { EncryptionError } from './errors'

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

  it('should throw an EncryptionError if the encrypter throws', async () => {
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
    await expect(addAccountPromise).rejects.toThrow(new EncryptionError({
      cause: innerError
    }))
  })
})

interface SutFactoryResponse {
  sut: DbAddAccountUseCase
  encrypterStub: Encrypter
}

const createSut = (): SutFactoryResponse => {
  const encrypterStub = createEncrypter()
  const sut = new DbAddAccountUseCase(encrypterStub)

  return {
    sut,
    encrypterStub
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

const createDefaultAddAccountInput = (): AddAccountInput => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})
