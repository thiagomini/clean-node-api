import { Authentication } from '../../../domain/use-cases/authentication'
import { InvalidParamException, MissingParamException } from '../../errors'
import { badRequest, EmailValidator, HttpRequest, internalServerError } from '../../protocols'
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
})

interface SutFactoryResponse {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const createSut = (): SutFactoryResponse => {
  const emailValidatorStub = createEmailValidatorStub()
  const authenticationStub = createAuthenticationStub()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
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
