import { createMock } from '@golevelup/ts-jest'
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
