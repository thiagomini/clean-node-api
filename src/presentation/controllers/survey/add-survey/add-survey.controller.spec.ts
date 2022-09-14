import { badRequest, internalServerError, noContent } from '../../../utils/http-responses-factories'
import { AddSurveyUseCase, HttpRequest, Optional, Validation } from './add-survey-controller.protocols'
import { AddSurveyController } from './add-survey.controller'
describe('AddSurveyController', () => {
  it('should call Validation with correct values', async () => {
    // Arrange
    const { validationStub, sut } = createSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = createFakeRequest()

    // Act
    await sut.handle(httpRequest)

    // Assert
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if validation fails', async () => {
    // Arrange
    const { validationStub, sut } = createSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = createFakeRequest()

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  it('should call AddSurveyUseCase with correct values', async () => {
    // Arrange
    const { sut, addSurveyStub } = createSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = createFakeRequest()

    // Act
    await sut.handle(httpRequest)

    // Assert
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 500 if AddSurveyUseCase fails', async () => {
    // Arrange
    const { addSurveyStub, sut } = createSut()
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new Error())
    const httpRequest = createFakeRequest()

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })

  it('should retrun 204 on success', async () => {
    const { sut } = createSut()

    const httpResponse = await sut.handle(createFakeRequest())

    expect(httpResponse).toEqual(noContent())
  })
})

interface SutFactoryResponse {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurveyUseCase
}

const createSut = (): SutFactoryResponse => {
  const validationStub = createValidationStub()
  const addSurveyStub = createAddSurveyStub()
  const sut = new AddSurveyController(validationStub, addSurveyStub)

  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

const createValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (): Optional<Error> {
      return undefined
    }
  }
  const validationStub = new ValidationStub()
  return validationStub
}

const createAddSurveyStub = (): AddSurveyUseCase => {
  class AddSurveyStub implements AddSurveyUseCase {
    async add (): Promise<void> {}
  }

  return new AddSurveyStub()
}

const createFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})
