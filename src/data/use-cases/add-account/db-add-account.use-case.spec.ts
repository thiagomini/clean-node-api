import { AddAccountInput } from '../../../domain/use-cases/add-account'
import { Encrypter } from '../../protocols'
import { DbAddAccountUseCase } from './db-add-account.use-case'

describe('DbAddAccountUseCase', () => {
  it('should call Encrypter with correct password', async () => {
    class EncrypterStub implements Encrypter {
      async encrypt (password: string): Promise<string> {
        return 'hashed_password'
      }
    }
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccountUseCase(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData: AddAccountInput = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })
})
