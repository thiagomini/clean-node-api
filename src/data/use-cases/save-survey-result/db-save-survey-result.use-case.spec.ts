import {
  CreateOrUpdateSurveyResultRepository,
  SaveSurveyResultInput,
} from './db-save-survey-result.protocols'
import { DbSaveSurveyResultUseCase } from './db-save-survey-result.use-case'
import { SaveSurveyResultUseCaseError } from './save-survey-result.use-case.error'

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

  it('should throw a SaveSurveyResultUseCaseError when CreateOrUpdateSurveyResultRepository throws an unexpected error', async () => {
    // Arrange
    const { sut, createOrUpdateSurveyRepositoryStub } = createSut()
    jest
      .spyOn(createOrUpdateSurveyRepositoryStub, 'createOrUpdate')
      .mockRejectedValueOnce(new Error('Unexpected error'))
    const saveSurveyResultInput = fakeSurveyResultInput()

    // Act
    const savePromise = sut.save(saveSurveyResultInput)

    // Assert
    await expect(savePromise).rejects.toThrowError(SaveSurveyResultUseCaseError)
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
