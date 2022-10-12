import {
  NonexistentAccountError,
  NonexistentSurveyError,
} from '@/domain/use-cases/survey-result/save-survey-result/errors'
import { SurveyModel, SurveyResultModel } from '@/domain/models'
import {
  CreateOrUpdateSurveyResultRepository,
  SaveSurveyResultInput,
} from './db-save-survey-result.protocols'
import { DbSaveSurveyResultUseCase } from './db-save-survey-result.use-case'
import { SaveSurveyResultUseCaseError } from './errors/'
import { createMock } from '@golevelup/ts-jest'
import { FindSurveyByIdRepository } from '../../survey/find-survey/find-survey-by-id.protocols'

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

  it('should call FindSurveyById with correct values', async () => {
    // Arrange
    const { sut, findSurveyByIdStub } = createSut()
    const findByIdSpy = jest.spyOn(findSurveyByIdStub, 'findById')
    const saveSurveyResultInput = fakeSurveyResultInput()

    // Act
    await sut.save(saveSurveyResultInput)

    // Assert
    expect(findByIdSpy).toHaveBeenCalledWith(saveSurveyResultInput.surveyId)
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

  it('should bubble up error if CreateOrUpdateSurveyResultRepository throws NonexistentSurveyError', async () => {
    // Arrange
    const { sut, createOrUpdateSurveyRepositoryStub } = createSut()
    jest
      .spyOn(createOrUpdateSurveyRepositoryStub, 'createOrUpdate')
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
      .spyOn(createOrUpdateSurveyRepositoryStub, 'createOrUpdate')
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
  findSurveyByIdStub: FindSurveyByIdRepository
}

const createSut = (): SutFactoryResponse => {
  const createOrUpdateSurveyResultRepositoryStub =
    makeCreateOrUpdateSurveyRepositoryStub()

  const findSurveyByIdStub = createMock<FindSurveyByIdRepository>({
    async findById() {
      return fakeSurvey()
    },
  })

  const sut = new DbSaveSurveyResultUseCase(
    createOrUpdateSurveyResultRepositoryStub,
    findSurveyByIdStub
  )

  return {
    sut,
    createOrUpdateSurveyRepositoryStub:
      createOrUpdateSurveyResultRepositoryStub,
    findSurveyByIdStub,
  }
}

const fakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  answers: [],
  createdAt: new Date(),
  question: 'any_question',
})

const makeCreateOrUpdateSurveyRepositoryStub =
  (): CreateOrUpdateSurveyResultRepository => {
    class RepositoryStub implements CreateOrUpdateSurveyResultRepository {
      async createOrUpdate(): Promise<SurveyResultModel> {
        return {
          accountId: 'any_account_id',
          surveyId: 'any_survey_id',
          answer: 'any_answer',
          createdAt: new Date(),
          id: 'any_id',
        }
      }
    }

    return new RepositoryStub()
  }

const fakeSurveyResultInput = (): SaveSurveyResultInput => ({
  accountId: 'any_id',
  answer: 'any_answer',
  surveyId: 'any_survey_id',
})
