import { LoadSurveySummaryUseCase } from '@/domain/use-cases/survey/load-survey-summary'
import { createLoadSurveySummaryStub } from '../../../../domain/test'
import { HttpRequest } from '@/presentation/protocols'
import { LoadSurveySummaryController } from './load-survey-summary.controller'

describe('LoadSurveySummaryController', () => {
  it('should call LoadSurveySummaryUseCase with the survey id', async () => {
    const { sut, loadSurveySummaryUseCaseStub } = createSut()
    const request = fakeRequest()

    await sut.handle(request)

    expect(loadSurveySummaryUseCaseStub.load).toHaveBeenCalledWith(
      request.params?.surveyId
    )
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
