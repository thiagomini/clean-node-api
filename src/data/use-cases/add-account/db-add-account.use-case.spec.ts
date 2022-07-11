import { AddAccountInput } from '../../../domain/use-cases/add-account'
import { Encrypter } from '../../protocols'
import { DbAddAccountUseCase } from './db-add-account.use-case'

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
})

interface SutFactoryResponse {
  sut: DbAddAccountUseCase
  encrypterStub: Encrypter
}

const createSut = (): SutFactoryResponse => {
  class EncrypterStub implements Encrypter {
    async encrypt (password: string): Promise<string> {
      return 'hashed_password'
    }
  }
  const encrypterStub = new EncrypterStub()
  const sut = new DbAddAccountUseCase(encrypterStub)

  return {
    sut,
    encrypterStub
  }
}

const createDefaultAddAccountInput = (): AddAccountInput => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})
