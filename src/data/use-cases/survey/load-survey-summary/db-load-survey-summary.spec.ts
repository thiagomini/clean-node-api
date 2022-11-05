import { faker } from '@faker-js/faker'
import { createLoadSurveySummaryByIdRepositoryStub } from '@/data/test'
import { LoadSurveySummaryByIdRepository } from '@/data/protocols/db/survey-repository'
import { DbLoadSurveySummaryUseCase } from './db-load-survey-summary.use-case'

describe('DbLoadSurveySummaryUseCase', () => {
  it('should call the LoadSurveySummaryByIdRepository with the surveyId', async () => {
    const { sut, loadSurveySummaryById } = createSut()
    const surveyId = faker.datatype.uuid()

    await sut.load(surveyId)

    expect(loadSurveySummaryById.loadSummaryById).toHaveBeenCalledWith(surveyId)
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
