import { createAddAccountUseCaseStub, fakeAccount } from '@/domain/test'
import { Authentication } from '@/domain/use-cases/authentication'
import {
  ExistingEmailException,
  MissingParamException,
} from '@/presentation/errors'
import {
  createAuthenticationStub,
  createValidationStub,
} from '@/presentation/test'
import { pick } from '@/presentation/utils'
import {
  badRequest,
  forbidden,
  internalServerError,
  ok,
} from '@/presentation/utils/http-responses-factories'
import { Role } from '@/auth'
import { SignUpController } from './signup.controller'
import {
  AddAccountUseCase,
  HttpRequest,
  Validation,
} from './signup.controller.protocols'

describe('SignupController', () => {
  it('should call AddAccountUseCase with correct values', async () => {
    // Arrange
    const { sut, addAccountUseCase } = createSut()
    const addSpy = jest.spyOn(addAccountUseCase, 'findOrCreate')

    const httpRequest = createDefaultRequest()

    // Act
    await sut.handle(httpRequest)

    // Assert
    expect(addSpy).toHaveBeenCalledWith({
      ...pick(httpRequest.body, 'name', 'email', 'password'),
      role: Role.User,
    })
  })

  it('should call Authentication with correct values', async () => {
    // Arrange
    const { sut, authenticationStub } = createSut()
    const authenticateSpy = jest.spyOn(authenticationStub, 'authenticate')
    const httpRequest: HttpRequest = createDefaultRequest()

    // Act
    await sut.handle(httpRequest)

    // Assert
    expect(authenticateSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password',
    })
  })

  it('should return INTERNAL_SERVER_ERROR if AddAccountUseCase throws an error', async () => {
    // Arrange
    const { sut, addAccountUseCase } = createSut()
    const errorThrown = new Error('error')

    jest.spyOn(addAccountUseCase, 'findOrCreate').mockImplementationOnce(() => {
      throw errorThrown
    })

    const httpRequest = createDefaultRequest()

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(internalServerError(errorThrown))
  })

  it('should return INTERNAL_SERVER_ERROR if Authentication throws an error', async () => {
    // Arrange
    const { sut, authenticationStub } = createSut()
    const errorThrown = new Error('error')

    jest
      .spyOn(authenticationStub, 'authenticate')
      .mockImplementationOnce(() => {
        throw errorThrown
      })

    const httpRequest = createDefaultRequest()

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(internalServerError(errorThrown))
  })

  it('should return OK (200) with user token if valid data is provided', async () => {
    // Arrange
    const { sut } = createSut()
    const httpRequest = createDefaultRequest()

    // Act
    const response = await sut.handle(httpRequest)

    // Assert
    expect(response).toEqual(
      ok({
        accessToken: 'valid_token',
      })
    )
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
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamException('any_field'))

    const httpRequest = createDefaultRequest()

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(
      badRequest(new MissingParamException('any_field'))
    )
  })

  it('should return forbidden if email already exists', async () => {
    // Arrange
    const { sut, addAccountUseCase } = createSut()
    jest.spyOn(addAccountUseCase, 'findOrCreate').mockResolvedValueOnce({
      ...fakeAccount(),
      isNew: false,
    })

    const httpRequest = createDefaultRequest()

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(
      forbidden(new ExistingEmailException('any_email@mail.com'))
    )
  })
})

interface SutFactoryResponse {
  sut: SignUpController
  addAccountUseCase: AddAccountUseCase
  validationStub: Validation
  authenticationStub: Authentication
}

const createSut = (): SutFactoryResponse => {
  const addAccountUseCase = createAddAccountUseCaseStub()
  const validationStub = createValidationStub()
  const authenticationStub = createAuthenticationStub()
  const sut = new SignUpController(
    addAccountUseCase,
    validationStub,
    authenticationStub
  )
  return {
    sut,
    addAccountUseCase,
    validationStub,
    authenticationStub,
  }
}

type RequestBody = Partial<{
  name: string
  email: string
  password: string
  passwordConfirmation: string
}>

function createDefaultRequestBody(): RequestBody {
  return {
    name: 'any_namy',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  }
}

function createDefaultRequest(): HttpRequest {
  return {
    body: createDefaultRequestBody(),
  }
}
