import { LoadSurveySummaryUseCase } from '@/domain/use-cases/survey/load-survey-summary'
import {
  createLoadSurveySummaryStub,
  fakeSurveySummary,
} from '../../../../domain/test'
import { HttpRequest } from '@/presentation/protocols'
import { LoadSurveySummaryController } from './load-survey-summary.controller'
import { NonexistentSurveyError } from '../../../../domain/use-cases/survey-result/save-survey-result/errors'
import {
  internalServerError,
  notFound,
  ok,
} from '../../../utils/http-responses-factories'

describe('LoadSurveySummaryController', () => {
  it('should call LoadSurveySummaryUseCase with the survey id', async () => {
    const { sut, loadSurveySummaryUseCaseStub } = createSut()
    const request = fakeRequest()

    await sut.handle(request)

    expect(loadSurveySummaryUseCaseStub.load).toHaveBeenCalledWith(
      request.params?.surveyId
    )
  })

  it('should return notFoundError if LoadSurveySummaryUseCase throws a SurveyNotFoundError', async () => {
    const { sut, loadSurveySummaryUseCaseStub } = createSut()
    const request = fakeRequest()
    const surveyId = request.params?.surveyId

    jest.spyOn(loadSurveySummaryUseCaseStub, 'load').mockRejectedValueOnce(
      new NonexistentSurveyError({
        surveyId,
      })
    )

    const response = await sut.handle(request)

    expect(response).toEqual(
      notFound({
        cause: expect.any(NonexistentSurveyError),
        entityName: 'Survey',
        missingId: surveyId,
      })
    )
  })

  it('should return internalServerError if LoadSurveySummaryUseCase throws a unexpected error', async () => {
    const { sut, loadSurveySummaryUseCaseStub } = createSut()
    const request = fakeRequest()

    const stubbedError = new Error('Something went wrong')

    jest
      .spyOn(loadSurveySummaryUseCaseStub, 'load')
      .mockRejectedValueOnce(stubbedError)

    const response = await sut.handle(request)

    expect(response).toEqual(
      internalServerError({
        message: stubbedError.message,
        name: stubbedError.name,
        stack: stubbedError.stack,
      })
    )
  })

  it('should return a survey summary on success', async () => {
    const { sut } = createSut()
    const request = fakeRequest()

    const response = await sut.handle(request)

    expect(response).toEqual(ok(fakeSurveySummary()))
  })
})

interface SutFactoryResponse {
  sut: LoadSurveySummaryController
  loadSurveySummaryUseCaseStub: LoadSurveySummaryUseCase
}

const createSut = (): SutFactoryResponse => {
  const loadSurveySummaryUseCaseStub = createLoadSurveySummaryStub()
  const sut = new LoadSurveySummaryController(loadSurveySummaryUseCaseStub)

  return {
    sut,
    loadSurveySummaryUseCaseStub,
  }
}

const fakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'survey_id',
  },
})
