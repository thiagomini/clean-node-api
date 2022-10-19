import {
  createEncrypterStub,
  createHashComparerStub,
  createLoadAccountByEmailRepositoryStub,
  createUpdateAccessTokenRepositoryStub,
} from '@/data/test'
import { fakeAccount, fakeAuthenticationInput } from '@/domain/test'
import {
  AuthenticationError,
  Encrypter,
  HashComparer,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from './db-authentication-protocols'
import { DbAuthenticationUseCase } from './db-authentication.use-case'

describe('DbAuthenticationUseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = createSut()
    const loadAccountByEmailSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail'
    )

    await sut.authenticate(fakeAuthenticationInput())

    expect(loadAccountByEmailSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })

  it('should throw AuthenticationError if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = createSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockRejectedValueOnce(new Error())

    const authenticatePromise = sut.authenticate(fakeAuthenticationInput())

    await expect(authenticatePromise).rejects.toThrowError(AuthenticationError)
  })

  it('should return undefined if user does not exist', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = createSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockResolvedValueOnce(undefined)

    const response = await sut.authenticate(fakeAuthenticationInput())

    expect(response).toBeUndefined()
  })

  it('should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = createSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')

    await sut.authenticate(fakeAuthenticationInput())

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  it('should throw AuthenticationError if HashComparer throws', async () => {
    const { sut, hashComparerStub } = createSut()
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())

    const authenticatePromise = sut.authenticate(fakeAuthenticationInput())

    await expect(authenticatePromise).rejects.toThrowError(AuthenticationError)
  })

  it('should return undefined if password comparison fails', async () => {
    const { sut, hashComparerStub } = createSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)

    const response = await sut.authenticate(fakeAuthenticationInput())

    expect(response).toBeUndefined()
  })

  it('should call TokenGenerator with correct id', async () => {
    const { sut, ecrypterStub } = createSut()
    const generateSpy = jest.spyOn(ecrypterStub, 'encrypt')

    await sut.authenticate(fakeAuthenticationInput())

    expect(generateSpy).toHaveBeenCalledWith('valid_id')
  })

  it('should throw AuthenticationError if TokenGenerator throws', async () => {
    const { sut, ecrypterStub } = createSut()
    jest.spyOn(ecrypterStub, 'encrypt').mockRejectedValueOnce(new Error())

    const authenticatePromise = sut.authenticate(fakeAuthenticationInput())

    await expect(authenticatePromise).rejects.toThrowError(AuthenticationError)
  })

  it('should return a token on success', async () => {
    const { sut } = createSut()

    const response = await sut.authenticate(fakeAuthenticationInput())

    expect(response).toBe('token')
  })

  it('should call UpdateAccessTokenRepository with correct values on success', async () => {
    const { sut, updateAccessTokenRepositoryStub } = createSut()
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken'
    )

    await sut.authenticate(fakeAuthenticationInput())

    expect(updateSpy).toHaveBeenCalledWith('valid_id', 'token')
  })

  it('should throw AuthenticationError if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = createSut()
    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockRejectedValueOnce(new Error())

    const authenticatePromise = sut.authenticate(fakeAuthenticationInput())

    await expect(authenticatePromise).rejects.toThrowError(AuthenticationError)
  })
})

type SutFactoryResponse = {
  sut: DbAuthenticationUseCase
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  ecrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const createSut = (): SutFactoryResponse => {
  const loadAccountByEmailRepositoryStub =
    createLoadAccountByEmailRepositoryStub(fakeAccount())
  const hashComparerStub = createHashComparerStub()
  const ecrypterStub = createEncrypterStub()
  const updateAccessTokenRepositoryStub =
    createUpdateAccessTokenRepositoryStub()
  const sut = new DbAuthenticationUseCase(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    ecrypterStub,
    updateAccessTokenRepositoryStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    ecrypterStub,
    updateAccessTokenRepositoryStub,
  }
}
