import {
  pick,
  internalServerError,
  ok,
  badRequest,
  forbidden,
} from '@/presentation/utils'
import { SignUpController } from '@/presentation/controllers'
import { Role } from '@/auth'
import { fakeAccount, createAddAccountUseCaseStub } from '../../domain/mocks'
import { AddAccountUseCase } from '@/domain/use-cases/account/add-account'
import { Authentication } from '@/domain/use-cases/authentication'
import {
  MissingParamException,
  ExistingEmailException,
} from '@/presentation/errors'
import { createValidationStub, createAuthenticationStub } from '../mocks'
import { Validation } from '@/presentation/protocols'

describe('SignupController', () => {
  it('should call AddAccountUseCase with correct values', async () => {
    // Arrange
    const { sut, addAccountUseCase } = createSut()
    const addSpy = jest.spyOn(addAccountUseCase, 'findOrCreate')

    const request = createDefaultRequest()

    // Act
    await sut.handle(request)

    // Assert
    expect(addSpy).toHaveBeenCalledWith({
      ...pick(request, 'name', 'email', 'password'),
      role: Role.User,
    })
  })

  it('should call Authentication with correct values', async () => {
    // Arrange
    const { sut, authenticationStub } = createSut()
    const authenticateSpy = jest.spyOn(authenticationStub, 'authenticate')
    const request = createDefaultRequest()

    // Act
    await sut.handle(request)

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

    const request = createDefaultRequest()

    // Act
    const httpResponse = await sut.handle(request)

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

    const request = createDefaultRequest()

    // Act
    const httpResponse = await sut.handle(request)

    // Assert
    expect(httpResponse).toEqual(internalServerError(errorThrown))
  })

  it('should return OK (200) with user token if valid data is provided', async () => {
    // Arrange
    const { sut } = createSut()
    const request = createDefaultRequest()

    // Act
    const response = await sut.handle(request)

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

    const request = createDefaultRequest()

    // Act
    await sut.handle(request)

    // Assert
    expect(validateSpy).toHaveBeenCalledWith(request)
  })

  it('should return badRequest if Validation returns an error', async () => {
    // Arrange
    const { sut, validationStub } = createSut()
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamException('any_field'))

    const request = createDefaultRequest()

    // Act
    const httpResponse = await sut.handle(request)

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

    const request = createDefaultRequest()

    // Act
    const httpResponse = await sut.handle(request)

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

function createDefaultRequest(): SignUpController.Request {
  return {
    name: 'any_namy',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  }
}
