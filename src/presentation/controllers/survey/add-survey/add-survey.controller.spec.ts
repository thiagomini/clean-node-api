import { badRequest } from '../../../utils/http-responses-factories'
import { HttpRequest, Validation, Optional } from './add-survey-controller.protocols'
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
})

interface SutFactoryResponse {
  sut: AddSurveyController
  validationStub: Validation
}

const createSut = (): SutFactoryResponse => {
  const validationStub = createValidationStub()
  const sut = new AddSurveyController(validationStub)

  return {
    sut,
    validationStub
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

const createFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})
