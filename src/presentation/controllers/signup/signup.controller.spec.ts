import { Optional } from '../../../utils'
import { MissingParamException } from '../../errors'
import { pick } from '../../utils'
import { badRequest, internalServerError, ok } from '../../utils/http-responses-factories'
import { SignUpController } from './signup.controller'
import { AccountModel, AddAccountInput, AddAccountUseCase, HttpRequest, Validation } from './signup.controller.protocols'

describe('SignupController', () => {
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
  addAccountUseCase: AddAccountUseCase
  validationStub: Validation
}

const createSut = (): SutFactoryResponse => {
  const addAccountUseCase = createAddAccountUseCase()
  const validationStub = createValidation()
  const sut = new SignUpController(addAccountUseCase, validationStub)
  return {
    sut,
    addAccountUseCase,
    validationStub
  }
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
