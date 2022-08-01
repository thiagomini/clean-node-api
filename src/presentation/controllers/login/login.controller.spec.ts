import { Authentication } from '../../../domain/use-cases/authentication'
import { Optional } from '../../../utils'
import { InvalidParamException, MissingParamException } from '../../errors'
import { EmailValidator, HttpRequest } from '../../protocols'
import { badRequest, internalServerError, unauthorized, ok } from '../../utils/http-responses-factories'
import { Validation } from '../../validators'
import { LoginController } from './login.controller'

describe('LoginController', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = createSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamException('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = createSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamException('password')))
  })

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = createSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest: HttpRequest = createFakeRequest()
    await sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('should return badRequest if email is invalid', async () => {
    // Arrange
    const { sut, emailValidatorStub } = createSut()
    const httpRequest: HttpRequest = createFakeRequest()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(badRequest(new InvalidParamException('email')))
  })

  it('should return internalServerError if email validator is invalid', async () => {
    // Arrange
    const { sut, emailValidatorStub } = createSut()
    const httpRequest: HttpRequest = createFakeRequest()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })

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
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
  validationStub: Validation
}

const createSut = (): SutFactoryResponse => {
  const emailValidatorStub = createEmailValidatorStub()
  const validationStub = createValidationStub()
  const authenticationStub = createAuthenticationStub()
  const sut = new LoginController(emailValidatorStub, authenticationStub, validationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub,
    validationStub
  }
}

const createEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
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
