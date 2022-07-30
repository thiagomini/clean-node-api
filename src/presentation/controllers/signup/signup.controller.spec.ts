import { Optional } from '../../../utils'
import { InvalidParamException, MissingParamException } from '../../errors'
import { pick } from '../../utils'
import { badRequest, internalServerError, ok } from '../../utils/http-responses-factories'
import { SignUpController } from './signup.controller'
import { AccountModel, AddAccountInput, AddAccountUseCase, EmailValidator, HttpRequest, Validation } from './signup.protocols'

describe('SignupController', () => {
  it('should return BAD_REQUEST if passwordConfirmation is different than the password', async () => {
    // Arrange
    const { sut } = createSut()

    const httpRequest = createRequestWithMismatchingPassword()

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(badRequest(new InvalidParamException('passwordConfirmation')))
  })

  it('should return BAD_REQUEST if given email is invalid', async () => {
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
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(badRequest(new InvalidParamException('email')))
  })

  it('should call EmailValidator with correct email', async () => {
    // Arrange
    const { sut, emailValidator } = createSut()
    const emailValidatorSpy = jest.spyOn(emailValidator, 'isValid')

    const httpRequest = createDefaultRequest()

    // Act
    await sut.handle(httpRequest)

    // Assert
    expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  it('should return INTERNAL_SERVER_ERROR if EmailValidator throws an error', async () => {
    // Arrange
    const { sut, emailValidator } = createSut()
    const errorThrown = new Error('error')

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw errorThrown
    })

    const httpRequest = createDefaultRequest()

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(internalServerError(errorThrown))
  })

  it('should call AddAccountUseCase with correct values', async () => {
    // Arrange
    const { sut, addAccountUseCase } = createSut()
    const addSpy = jest.spyOn(addAccountUseCase, 'add')

    const httpRequest = createDefaultRequest()

    // Act
    await sut.handle(httpRequest)

    // Assert
    expect(addSpy).toHaveBeenCalledWith(pick(httpRequest.body, 'name', 'email', 'password'))
  })

  it('should return INTERNAL_SERVER_ERROR if AddAccountUseCase throws an error', async () => {
    // Arrange
    const { sut, addAccountUseCase } = createSut()
    const errorThrown = new Error('error')

    jest.spyOn(addAccountUseCase, 'add').mockImplementationOnce(() => {
      throw errorThrown
    })

    const httpRequest = createDefaultRequest()

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(internalServerError(errorThrown))
  })

  it('should return OK (200) if valid data is provided', async () => {
    // Arrange
    const { sut } = createSut()
    const httpRequest = createDefaultRequest()

    // Act
    const response = await sut.handle(httpRequest)

    // Assert
    expect(response).toEqual(ok(CREATED_ACCOUNT_RESPONSE))
  })

  it('should call Validation with correct value', async () => {
    // Arrange
    const { sut, validationStub } = createSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = createDefaultRequest()

    // Act
    await sut.handle(httpRequest)

    // Assert
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return badRequest if Validation returns an error', async () => {
    // Arrange
    const { sut, validationStub } = createSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamException('any_field'))

    const httpRequest = createDefaultRequest()

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(badRequest(new MissingParamException('any_field')))
  })
})

interface SutFactoryResponse {
  sut: SignUpController
  emailValidator: EmailValidator
  addAccountUseCase: AddAccountUseCase
  validationStub: Validation
}

const createSut = (): SutFactoryResponse => {
  const emailValidator = createEmailValidator()
  const addAccountUseCase = createAddAccountUseCase()
  const validationStub = createValidation()
  const sut = new SignUpController(emailValidator, addAccountUseCase, validationStub)
  return {
    sut,
    emailValidator,
    addAccountUseCase,
    validationStub
  }
}

const createEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const createAddAccountUseCase = (): AddAccountUseCase => {
  class AddAccountStub implements AddAccountUseCase {
    async add (account: AddAccountInput): Promise<AccountModel> {
      return CREATED_ACCOUNT_RESPONSE
    }
  }
  return new AddAccountStub()
}

const CREATED_ACCOUNT_RESPONSE: AccountModel = {
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
}

const createValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (): Optional<Error> {
      return undefined
    }
  }

  return new ValidationStub()
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

function createDefaultRequest (): HttpRequest {
  return {
    body: createDefaultRequestBody()
  }
}

function createRequestWithMismatchingPassword (): HttpRequest {
  const defaultRequest = createDefaultRequest()
  defaultRequest.body.passwordConfirmation = 'different'

  return defaultRequest
}
