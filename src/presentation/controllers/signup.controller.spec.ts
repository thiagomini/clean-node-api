import { MissingParamException } from '../errors'
import { HttpStatusCodes } from '../protocols'
import { SignUpController } from './signup.controller'

const createSut = (): SignUpController => {
  return new SignUpController()
}

describe('SignupController', () => {
  it('should return BAD_REQUEST if no name is provided', () => {
    const sut = createSut()

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
    const sut = createSut()

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
    const sut = createSut()

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
    const sut = createSut()

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
})
