import { AccountModel } from '../../../domain/models'
import { AuthenticationInput } from '../../../domain/use-cases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols'
import { AuthenticationError } from './authentication.error'
import { DbAuthenticationUseCase } from './db-authentication.use-case'

describe('DbAuthenticationUseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = createSut()
    const loadAccountByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

    await sut.authenticate(createFakeAuthenticationInput())

    expect(loadAccountByEmailSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })

  it('should throw AuthenticationError if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = createSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockRejectedValueOnce(new Error())

    const authenticatePromise = sut.authenticate(createFakeAuthenticationInput())

    await expect(authenticatePromise).rejects.toThrowError(AuthenticationError)
  })
})

interface SutFactoryResponse {
  sut: DbAuthenticationUseCase
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const createSut = (): SutFactoryResponse => {
  const loadAccountByEmailRepositoryStub = createLoadAccountByEmailRepoStub()
  const sut = new DbAuthenticationUseCase(loadAccountByEmailRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

const createLoadAccountByEmailRepoStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    public async load (email: string): Promise<AccountModel> {
      return {
        email,
        id: 'valid_id',
        name: 'any_name',
        password: 'any_password'
      }
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const createFakeAuthenticationInput = (): AuthenticationInput => ({
  email: 'any_mail@mail.com',
  password: 'any_password'
})