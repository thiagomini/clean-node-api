import { createMock } from '@golevelup/ts-jest'
import {
  NonexistentAccountError,
  NonexistentSurveyError,
} from '../../../../domain/use-cases/survey-result/save-survey-result/errors'
import { notFound } from '../../../utils/http-responses-factories'
import {
  HttpRequest,
  SaveSurveyResultUseCase,
} from './save-survey-result-controller.protocols'
import { SaveSurveyResultController } from './save-survey-result.controller'

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
      accountId: request.body.accountId,
      surveyId: request.params?.surveyId,
      answer: request.body.answer,
    })
  })

  it('should return a 404 when SaveSurveyResultUseCase throws a NonexistentSurveyError', async () => {
    // Arrange
    const { sut, saveSurveyResultUseCaseStub } = createSut()
    const request = fakeRequest()
    const thrownError = new NonexistentSurveyError({
      surveyId: request.params?.surveyId,
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
        entityName: 'SurveyResult',
        missingId: request.params?.surveyId,
      })
    )
  })

  it('should return a 404 when SaveSurveyResultUseCase throws a NonexistentAccountError', async () => {
    // Arrange
    const { sut, saveSurveyResultUseCaseStub } = createSut()
    const request = fakeRequest()
    const thrownError = new NonexistentAccountError({
      accountId: request.body?.accountId,
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
        missingId: request.body?.accountId,
      })
    )
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

const fakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'valid_survey_id',
  },
  body: {
    accountId: 'account_id',
    answer: 'answer',
  },
})
