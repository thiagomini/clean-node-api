import { Authentication } from '../../../domain/use-cases/authentication'
import { Optional } from '../../../utils'
import { MissingParamException } from '../../errors'
import { HttpRequest, Validation } from '../../protocols'
import { badRequest, internalServerError, ok, unauthorized } from '../../utils/http-responses-factories'
import { LoginController } from './login.controller'

describe('LoginController', () => {
  it('should call Authentication with correct values', async () => {
    // Arrange
    const { sut, authenticationStub } = createSut()
    const authenticateSpy = jest.spyOn(authenticationStub, 'authenticate')
    const httpRequest: HttpRequest = createFakeRequest()

    // Act
    await sut.handle(httpRequest)

    // Assert
    expect(authenticateSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password')
  })

  it('should return Unauthorized if invalid credentials are provided', async () => {
    // Arrange
    const { sut, authenticationStub } = createSut()
    const httpRequest: HttpRequest = createFakeRequest()
    jest.spyOn(authenticationStub, 'authenticate').mockResolvedValueOnce(undefined)

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(unauthorized())
  })

  it('should return internalServerError if Authentication throws', async () => {
    // Arrange
    const { sut, authenticationStub } = createSut()
    const httpRequest: HttpRequest = createFakeRequest()
    jest.spyOn(authenticationStub, 'authenticate').mockRejectedValueOnce(new Error())

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })

  it('should return user access token if credentials provided are valid', async () => {
    // Arrange
    const { sut } = createSut()
    const httpRequest: HttpRequest = createFakeRequest()

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(ok({
      accessToken: 'valid_token'
    }))
  })

  it('should return badRequest if Validation returns an error', async () => {
    // Arrange
    const { sut, validationStub } = createSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamException('any_field'))

    const httpRequest = createFakeRequest()

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(badRequest(new MissingParamException('any_field')))
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
    validationStub
  }
}

const createValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (): Optional<Error> {
      return undefined
    }
  }

  return new ValidationStub()
}

const createAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async authenticate (): Promise<string> {
      return 'valid_token'
    }
  }

  return new AuthenticationStub()
}

const createFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})
