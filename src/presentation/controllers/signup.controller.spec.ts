import { InvalidParamException, MissingParamException, ServerError } from '../errors'
import { EmailValidator, HttpRequest, HttpStatusCodes } from '../protocols'
import { SignUpController } from './signup.controller'

describe('SignupController', () => {
  it('should return BAD_REQUEST if no name is provided', () => {
    // Arrange
    const { sut } = createSut()

    const httpRequest = createRequestWithout('name')

    // Act
    const httpResponse = sut.handle(httpRequest)

    // Assert
    expect(httpResponse?.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
    expect(httpResponse?.body).toEqual(new MissingParamException('name'))
  })

  it('should return BAD_REQUEST if no email is provided', () => {
    // Arrange
    const { sut } = createSut()

    const httpRequest = createRequestWithout('email')

    // Act
    const httpResponse = sut.handle(httpRequest)

    // Assert
    expect(httpResponse?.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
    expect(httpResponse?.body).toEqual(new MissingParamException('email'))
  })

  it('should return BAD_REQUEST if no password is provided', () => {
    // Arrange
    const { sut } = createSut()

    const httpRequest = createRequestWithout('password')

    // Act
    const httpResponse = sut.handle(httpRequest)

    // Assert
    expect(httpResponse?.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
    expect(httpResponse?.body).toEqual(new MissingParamException('password'))
  })

  it('should return BAD_REQUEST if no passwordConfirmation is provided', () => {
    // Arrange
    const { sut } = createSut()

    const httpRequest = createRequestWithout('passwordConfirmation')

    // Act
    const httpResponse = sut.handle(httpRequest)

    // Assert
    expect(httpResponse?.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
    expect(httpResponse?.body).toEqual(new MissingParamException('passwordConfirmation'))
  })

  it('should return BAD_REQUEST if given email is invalid', () => {
    // Arrange
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

    // Act
    const httpResponse = sut.handle(httpRequest)

    // Assert
    expect(httpResponse?.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
    expect(httpResponse?.body).toEqual(new InvalidParamException('email'))
  })

  it('should call EmaiLValidator with correct email', () => {
    // Arrange
    const { sut, emailValidator } = createSut()
    const emailValidatorSpy = jest.spyOn(emailValidator, 'isValid')

    const httpRequest = createDefaultRequest()

    // Act
    sut.handle(httpRequest)

    // Assert
    expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  it('should return INTERNAL_SERVER_ERROR if EmailValidator throws an error', () => {
    // Arrange
    const { sut, emailValidator } = createSut()
    const errorThrown = new Error('error')

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw errorThrown
    })

    const httpRequest = createDefaultRequest()

    // Act
    const httpResponse = sut.handle(httpRequest)

    // Assert
    expect(httpResponse?.statusCode).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR)
    expect(httpResponse?.body).toEqual(new ServerError(errorThrown))
  })
})

interface SutFactoryResponse {
  sut: SignUpController
  emailValidator: EmailValidator
}

const createEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const createSut = (): SutFactoryResponse => {
  const emailValidator = createEmailValidator()
  const sut = new SignUpController(emailValidator)
  return {
    sut,
    emailValidator
  }
}

type RequestBody = Partial<{
  name: string
  email: string
  password: string
  passwordConfirmation: string
}>

function createDefaultRequestBody (): RequestBody {
  return {
    name: 'any_namy',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
}

function createRequestWithout (parameter: keyof RequestBody): HttpRequest {
  const defaultRequest: RequestBody = createDefaultRequestBody()

  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete defaultRequest[parameter]

  return {
    body: defaultRequest
  }
}

function createDefaultRequest (): HttpRequest {
  return {
    body: createDefaultRequestBody()
  }
}
