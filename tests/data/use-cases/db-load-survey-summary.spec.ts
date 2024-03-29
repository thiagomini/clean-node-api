import { faker } from '@faker-js/faker'
import {
  LoadSurveySummaryByIdRepository,
  NonexistentSurveyError,
  LoadSurveySummaryUseCaseError,
  DbLoadSurveySummaryUseCase,
} from '@/data/use-cases/survey/load-survey-summary'
import { createLoadSurveySummaryByIdRepositoryStub } from '../mocks'
import { fakeSurveySummary } from '../../domain/mocks'

describe('DbLoadSurveySummaryUseCase', () => {
  it('should call the LoadSurveySummaryByIdRepository with the surveyId', async () => {
    const { sut, loadSurveySummaryById } = createSut()
    const surveyId = faker.datatype.uuid()

    await sut.load(surveyId)

    expect(loadSurveySummaryById.loadSummaryById).toHaveBeenCalledWith(surveyId)
  })

  it('should throw a NonexistentSurveyError when the survey does not exist', async () => {
    const { sut, loadSurveySummaryById } = createSut()
    const surveyId = faker.datatype.uuid()
    jest
      .spyOn(loadSurveySummaryById, 'loadSummaryById')
      .mockResolvedValueOnce(undefined)

    const promise = sut.load(surveyId)

    await expect(promise).rejects.toThrowError(NonexistentSurveyError)
  })

  it('should throw a LoadSurveySummaryUseCaseError when the repository throws', async () => {
    const { sut, loadSurveySummaryById } = createSut()
    const surveyId = faker.datatype.uuid()
    jest
      .spyOn(loadSurveySummaryById, 'loadSummaryById')
      .mockRejectedValueOnce(new Error())

    const promise = sut.load(surveyId)

    await expect(promise).rejects.toThrowError(LoadSurveySummaryUseCaseError)
  })

  it('should return a survey summary on success', async () => {
    const { sut } = createSut()
    const surveyId = 'existing-survey-id'

    const surveySummary = await sut.load(surveyId)

    expect(surveySummary).toEqual(fakeSurveySummary())
  })
})

interface SutFactoryResponse {
  sut: DbLoadSurveySummaryUseCase
  loadSurveySummaryById: LoadSurveySummaryByIdRepository
}

const createSut = (): SutFactoryResponse => {
  const loadSurveySummaryById = createLoadSurveySummaryByIdRepositoryStub()
  const sut = new DbLoadSurveySummaryUseCase(loadSurveySummaryById)

  return {
    sut,
    loadSurveySummaryById,
  }
}
