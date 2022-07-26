import { InvalidParamException, MissingParamException } from '../../errors'
import { badRequest, EmailValidator, HttpRequest } from '../../protocols'
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

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('should return 400 if email is invalid', async () => {
    // Arrange
    const { sut, emailValidatorStub } = createSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'any_password'
      }
    }
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(badRequest(new InvalidParamException('email')))
  })
})

interface SutFactoryResponse {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

const createSut = (): SutFactoryResponse => {
  const emailValidatorStub = createEmailValidatorStub()
  const sut = new LoginController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
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
