import { InvalidParamException, MissingParamException } from '../errors'
import { EmailValidator, HttpStatusCodes } from '../protocols'
import { SignUpController } from './signup.controller'

interface SutFactoryResponse {
  sut: SignUpController
  emailValidator: EmailValidator
}

const createSut = (): SutFactoryResponse => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidator = new EmailValidatorStub()
  const sut = new SignUpController(emailValidator)
  return {
    sut,
    emailValidator
  }
}

describe('SignupController', () => {
  it('should return BAD_REQUEST if no name is provided', () => {
    const { sut } = createSut()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
    expect(httpResponse?.body).toEqual(new MissingParamException('name'))
  })

  it('should return BAD_REQUEST if no email is provided', () => {
    const { sut } = createSut()

    const httpRequest = {
      body: {
        name: 'any_namy',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
    expect(httpResponse?.body).toEqual(new MissingParamException('email'))
  })

  it('should return BAD_REQUEST if no password is provided', () => {
    const { sut } = createSut()

    const httpRequest = {
      body: {
        name: 'any_namy',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
    expect(httpResponse?.body).toEqual(new MissingParamException('password'))
  })

  it('should return BAD_REQUEST if no passwordConfirmation is provided', () => {
    const { sut } = createSut()

    const httpRequest = {
      body: {
        name: 'any_namy',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
    expect(httpResponse?.body).toEqual(new MissingParamException('passwordConfirmation'))
  })

  it('should return BAD_REQUEST if given email is invalid', () => {
    const { sut, emailValidator } = createSut()
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any_namy',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
    expect(httpResponse?.body).toEqual(new InvalidParamException('email'))
  })
})
