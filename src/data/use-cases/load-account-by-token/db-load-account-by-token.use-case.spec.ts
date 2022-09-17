import { Decrypter } from '../../protocols/cryptography'
import { DbLoadAccountByTokenUseCase } from './db-load-account-by-token.use-case'

const TOKEN = 'any_token'

describe('DbLoadAccountByTokenUseCase', () => {
  it('should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = createSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.load(TOKEN)

    expect(decryptSpy).toHaveBeenCalledWith(TOKEN)
  })
})

interface SutFactoryResponse {
  sut: DbLoadAccountByTokenUseCase
  decrypterStub: Decrypter
}

const createSut = (): SutFactoryResponse => {
  const decrypterStub = createDecrypterStub()
  const sut = new DbLoadAccountByTokenUseCase(decrypterStub)

  return {
    sut,
    decrypterStub,
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
