import { SaveSurveyResultInput } from '@/domain/use-cases/save-survey-result'
import { CreateOrUpdateSurveyResultRepository } from '../../protocols/db/survey-result-repository'
import { DbSaveSurveyResultUseCase } from './db-save-survey-result.use-case'

describe('DbSaveSurveyResultUseCase', () => {
  it('should call CreateOrUpdateSurveyResultRepository with correct values', async () => {
    // Arrange
    const { sut, createOrUpdateSurveyRepositoryStub } = createSut()
    const createOrUpdateSpy = jest.spyOn(
      createOrUpdateSurveyRepositoryStub,
      'createOrUpdate'
    )
    const saveSurveyResultInput = fakeSurveyResultInput()

    // Act
    await sut.save(saveSurveyResultInput)

    // Assert
    expect(createOrUpdateSpy).toHaveBeenCalledWith(saveSurveyResultInput)
  })
})

type SutFactoryResponse = {
  sut: DbSaveSurveyResultUseCase
  createOrUpdateSurveyRepositoryStub: CreateOrUpdateSurveyResultRepository
}

const createSut = (): SutFactoryResponse => {
  const createOrUpdateSurveyResultRepositoryStub =
    makeCreateOrUpdateSurveyRepositoryStub()
  const sut = new DbSaveSurveyResultUseCase(
    createOrUpdateSurveyResultRepositoryStub
  )

  return {
    sut,
    createOrUpdateSurveyRepositoryStub:
      createOrUpdateSurveyResultRepositoryStub,
  }
}

const makeCreateOrUpdateSurveyRepositoryStub =
  (): CreateOrUpdateSurveyResultRepository => {
    class RepositoryStub implements CreateOrUpdateSurveyResultRepository {
      async createOrUpdate(): Promise<void> {}
    }

    return new RepositoryStub()
  }

const fakeSurveyResultInput = (): SaveSurveyResultInput => ({
  accountId: 'any_id',
  answer: 'any_answer',
  surveyId: 'any_survey_id',
})
