import { Decrypter } from '../../protocols/cryptography'
import { DbLoadAccountByTokenUseCase } from './db-load-account-by-token.use-case'

describe('DbLoadAccountByTokenUseCase', () => {
  const TOKEN = 'any_token'

  it('should call Decrypter with correct values', async () => {
    class DecrypterStub implements Decrypter {
      public async decrypt(): Promise<string> {
        return TOKEN
      }
    }
    const decryptStub = new DecrypterStub()
    const decryptSpy = jest.spyOn(decryptStub, 'decrypt')
    const sut = new DbLoadAccountByTokenUseCase(decryptStub)

    await sut.load(TOKEN)

    expect(decryptSpy).toHaveBeenCalledWith(TOKEN)
  })
})
