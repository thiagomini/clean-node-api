import {
  badRequest,
  internalServerError,
  noContent,
} from '@/presentation/utils'
import { Validation } from '@/presentation/protocols'
import { AddSurveyController } from '@/presentation/controllers'
import { AddSurveyUseCase } from '@/domain/use-cases/survey/add-survey'
import { createAddSurveyStub } from '../../domain/mocks'
import { createValidationStub } from '../mocks'
describe('AddSurveyController', () => {
  it('should call Validation with correct values', async () => {
    // Arrange
    const { validationStub, sut } = createSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = createFakeRequest()

    // Act
    await sut.handle(request)

    // Assert
    expect(validateSpy).toHaveBeenCalledWith(request)
  })

  it('should return 400 if validation fails', async () => {
    // Arrange
    const { validationStub, sut } = createSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const request = createFakeRequest()

    // Act
    const httpResponse = await sut.handle(request)

    // Assert
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  it('should call AddSurveyUseCase with correct values', async () => {
    // Arrange
    const { sut, addSurveyStub } = createSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const request = createFakeRequest()

    // Act
    await sut.handle(request)

    // Assert
    expect(addSpy).toHaveBeenCalledWith(request)
  })

  it('should return 500 if AddSurveyUseCase fails', async () => {
    // Arrange
    const { addSurveyStub, sut } = createSut()
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new Error())
    const request = createFakeRequest()

    // Act
    const httpResponse = await sut.handle(request)

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
    addSurveyStub,
  }
}

const createFakeRequest = (): AddSurveyController.Request => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
})
