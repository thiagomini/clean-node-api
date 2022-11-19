import { Authentication } from '@/domain/use-cases/authentication'
import { LoginController } from '@/presentation/controllers'
import { MissingParamException } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '@/presentation/utils'
import { createAuthenticationStub, createValidationStub } from '../mocks'

describe('LoginController', () => {
  it('should call Authentication with correct values', async () => {
    // Arrange
    const { sut, authenticationStub } = createSut()
    const authenticateSpy = jest.spyOn(authenticationStub, 'authenticate')
    const request = createFakeRequest()

    // Act
    await sut.handle(request)

    // Assert
    expect(authenticateSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password',
    })
  })

  it('should return Unauthorized if invalid credentials are provided', async () => {
    // Arrange
    const { sut, authenticationStub } = createSut()
    const request = createFakeRequest()
    jest
      .spyOn(authenticationStub, 'authenticate')
      .mockResolvedValueOnce(undefined)

    // Act
    const httpResponse = await sut.handle(request)

    // Assert
    expect(httpResponse).toEqual(unauthorized())
  })

  it('should return internalServerError if Authentication throws', async () => {
    // Arrange
    const { sut, authenticationStub } = createSut()
    const request = createFakeRequest()
    jest
      .spyOn(authenticationStub, 'authenticate')
      .mockRejectedValueOnce(new Error())

    // Act
    const httpResponse = await sut.handle(request)

    // Assert
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })

  it('should return user access token if credentials provided are valid', async () => {
    // Arrange
    const { sut } = createSut()
    const request = createFakeRequest()

    // Act
    const httpResponse = await sut.handle(request)

    // Assert
    expect(httpResponse).toEqual(
      ok({
        accessToken: 'valid_token',
      })
    )
  })

  it('should return badRequest if Validation returns an error', async () => {
    // Arrange
    const { sut, validationStub } = createSut()
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamException('any_field'))

    const request = createFakeRequest()

    // Act
    const httpResponse = await sut.handle(request)

    // Assert
    expect(httpResponse).toEqual(
      badRequest(new MissingParamException('any_field'))
    )
  })
})

interface SutFactoryResponse {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const createSut = (): SutFactoryResponse => {
  const validationStub = createValidationStub()
  const authenticationStub = createAuthenticationStub()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub,
  }
}

const createFakeRequest = (): LoginController.Request => ({
  email: 'any_email@mail.com',
  password: 'any_password',
})
