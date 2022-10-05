import {
  NonexistentAccountError,
  NonexistentSurveyError,
} from '../../../domain/use-cases/save-survey-result/errors'
import {
  CreateOrUpdateSurveyResultRepository,
  SaveSurveyResultInput,
} from './db-save-survey-result.protocols'
import { DbSaveSurveyResultUseCase } from './db-save-survey-result.use-case'
import { SaveSurveyResultUseCaseError } from './errors/'

describe('DbSaveSurveyResultUseCase', () => {
  it('should call CreateOrUpdateSurveyResultRepository with correct values', async () => {
    // Arrange
    const { sut, createOrUpdateSurveyRepositoryStub } = createSut()
    const createOrUpdateSpy = jest.spyOn(
      createOrUpdateSurveyRepositoryStub,
      'createOrUpdateResult'
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
      .spyOn(createOrUpdateSurveyRepositoryStub, 'createOrUpdateResult')
      .mockRejectedValueOnce(new Error('Unexpected error'))
    const saveSurveyResultInput = fakeSurveyResultInput()

    // Act
    const savePromise = sut.save(saveSurveyResultInput)

    // Assert
    await expect(savePromise).rejects.toThrowError(SaveSurveyResultUseCaseError)
  })

  it('should bubble up error if CreateOrUpdateSurveyResultRepository throws NonexistentSurveyError', async () => {
    // Arrange
    const { sut, createOrUpdateSurveyRepositoryStub } = createSut()
    jest
      .spyOn(createOrUpdateSurveyRepositoryStub, 'createOrUpdateResult')
      .mockRejectedValueOnce(
        new NonexistentSurveyError({ surveyId: 'invalid_survey_id' })
      )
    const saveSurveyResultInput = fakeSurveyResultInput()

    // Act
    const savePromise = sut.save(saveSurveyResultInput)

    // Assert
    await expect(savePromise).rejects.toThrowError(NonexistentSurveyError)
  })

  it('should bubble up error if CreateOrUpdateSurveyResultRepository throws NonexistentAccountError', async () => {
    // Arrange
    const { sut, createOrUpdateSurveyRepositoryStub } = createSut()
    jest
      .spyOn(createOrUpdateSurveyRepositoryStub, 'createOrUpdateResult')
      .mockRejectedValueOnce(
        new NonexistentAccountError({ accountId: 'invalid_account_id' })
      )
    const saveSurveyResultInput = fakeSurveyResultInput()

    // Act
    const savePromise = sut.save(saveSurveyResultInput)

    // Assert
    await expect(savePromise).rejects.toThrowError(NonexistentAccountError)
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
      async createOrUpdateResult(): Promise<void> {}
    }

    return new RepositoryStub()
  }

const fakeSurveyResultInput = (): SaveSurveyResultInput => ({
  accountId: 'any_id',
  answer: 'any_answer',
  surveyId: 'any_survey_id',
})
