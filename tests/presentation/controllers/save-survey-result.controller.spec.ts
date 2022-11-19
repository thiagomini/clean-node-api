import {
  InvalidSurveyAnswerError,
  NonexistentAccountError,
  NonexistentSurveyError,
  SaveSurveyResultUseCase,
} from '@/domain/use-cases/survey-result/save-survey-result'
import { SaveSurveyResultController } from '@/presentation/controllers'
import {
  badRequest,
  internalServerError,
  noContent,
  notFound,
} from '@/presentation/utils'
import { createMock } from '@golevelup/ts-jest'

describe('SaveSurveyResultController', () => {
  it('should call SaveSurveyResultUseCase with correct values', async () => {
    // Arrange
    const { sut, saveSurveyResultUseCaseStub } = createSut()
    const saveSpy = jest.spyOn(saveSurveyResultUseCaseStub, 'save')
    const request = fakeRequest()

    // Act
    await sut.handle(request)

    // Assert
    expect(saveSpy).toHaveBeenCalledWith({
      accountId: request.accountId,
      surveyId: request.surveyId,
      answer: request.answer,
    })
  })

  it('should return a 404 when SaveSurveyResultUseCase throws a NonexistentSurveyError', async () => {
    // Arrange
    const { sut, saveSurveyResultUseCaseStub } = createSut()
    const request = fakeRequest()
    const thrownError = new NonexistentSurveyError({
      surveyId: request.surveyId,
    })

    jest
      .spyOn(saveSurveyResultUseCaseStub, 'save')
      .mockRejectedValueOnce(thrownError)

    // Act
    const httpResponse = await sut.handle(request)

    // Assert
    expect(httpResponse).toEqual(
      notFound({
        cause: thrownError,
        entityName: 'Survey',
        missingId: request.surveyId,
      })
    )
  })

  it('should return a 404 when SaveSurveyResultUseCase throws a NonexistentAccountError', async () => {
    // Arrange
    const { sut, saveSurveyResultUseCaseStub } = createSut()
    const request = fakeRequest()
    const thrownError = new NonexistentAccountError({
      accountId: request.accountId,
    })

    jest
      .spyOn(saveSurveyResultUseCaseStub, 'save')
      .mockRejectedValueOnce(thrownError)

    // Act
    const httpResponse = await sut.handle(request)

    // Assert
    expect(httpResponse).toEqual(
      notFound({
        cause: thrownError,
        entityName: 'Account',
        missingId: request.accountId,
      })
    )
  })

  it('should return a 400 when SaveSurveyResultUseCase throws an InvalidSurveyAnswerError', async () => {
    // Arrange
    const { sut, saveSurveyResultUseCaseStub } = createSut()
    const request = fakeRequest()
    const thrownError = new InvalidSurveyAnswerError({
      answer: request.answer,
      answers: [],
    })

    jest
      .spyOn(saveSurveyResultUseCaseStub, 'save')
      .mockRejectedValueOnce(thrownError)

    // Act
    const httpResponse = await sut.handle(request)

    // Assert
    expect(httpResponse).toEqual(badRequest(thrownError))
  })

  it('should return a 500 when SaveSurveyResultUseCase throws an unexpected error', async () => {
    // Arrange
    const { sut, saveSurveyResultUseCaseStub } = createSut()
    const request = fakeRequest()
    const thrownError = new Error('Unexpected error')

    jest
      .spyOn(saveSurveyResultUseCaseStub, 'save')
      .mockRejectedValueOnce(thrownError)

    // Act
    const httpResponse = await sut.handle(request)

    // Assert
    expect(httpResponse).toEqual(internalServerError(thrownError))
  })

  it('should return 204 on success', async () => {
    // Arrange
    const { sut } = createSut()
    const request = fakeRequest()

    // Act
    const httpResponse = await sut.handle(request)

    // Assert
    expect(httpResponse).toEqual(noContent())
  })
})

interface SutFactoryResponse {
  sut: SaveSurveyResultController
  saveSurveyResultUseCaseStub: SaveSurveyResultUseCase
}

const createSut = (): SutFactoryResponse => {
  const saveSurveyResultUseCaseStub = createMock<SaveSurveyResultUseCase>()
  const sut = new SaveSurveyResultController(saveSurveyResultUseCaseStub)

  return {
    sut,
    saveSurveyResultUseCaseStub,
  }
}

const fakeRequest = (): SaveSurveyResultController.Request => ({
  surveyId: 'valid_survey_id',
  answer: 'answer',
  accountId: 'account_id',
})
