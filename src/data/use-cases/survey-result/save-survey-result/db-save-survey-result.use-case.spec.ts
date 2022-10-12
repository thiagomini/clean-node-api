import {
  InvalidSurveyAnswerError,
  NonexistentAccountError,
  NonexistentSurveyError,
} from '@/domain/use-cases/survey-result/save-survey-result/errors'
import {
  CreateOrUpdateSurveyResultRepository,
  SaveSurveyResultInput,
  AccountModel,
  SurveyModel,
  SurveyResultModel,
  Role,
  LoadAccountByIdRepository,
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

  it('should throw NonexistentSurveyError when survey does not exist', async () => {
    // Arrange
    const { sut, findSurveyByIdStub } = createSut()
    jest.spyOn(findSurveyByIdStub, 'findById').mockResolvedValueOnce(undefined)

    const saveSurveyResultInput = fakeSurveyResultInput()

    // Act
    const savePromise = sut.save(saveSurveyResultInput)

    // Assert
    await expect(savePromise).rejects.toThrowError(NonexistentSurveyError)
  })

  it('should call LoadAccountById with correct values', async () => {
    // Arrange
    const { sut, loadAccountByIdStub } = createSut()
    const loadByIdSpy = jest.spyOn(loadAccountByIdStub, 'loadById')
    const saveSurveyResultInput = fakeSurveyResultInput()

    // Act
    await sut.save(saveSurveyResultInput)

    // Assert
    expect(loadByIdSpy).toHaveBeenCalledWith(saveSurveyResultInput.accountId)
  })

  it('should throw NonexistentAccountError when account does not exist', async () => {
    // Arrange
    const { sut, loadAccountByIdStub } = createSut()
    jest.spyOn(loadAccountByIdStub, 'loadById').mockResolvedValueOnce(undefined)

    const saveSurveyResultInput = fakeSurveyResultInput()

    // Act
    const savePromise = sut.save(saveSurveyResultInput)

    // Assert
    await expect(savePromise).rejects.toThrowError(NonexistentAccountError)
  })

  it('should throw InvalidSurveyAnswerError when survey does not contain given answer', async () => {
    // Arrange
    const { sut } = createSut()

    const saveSurveyResultInput = fakeSurveyResultInput()
    saveSurveyResultInput.answer = 'invalid_answer'

    // Act
    const savePromise = sut.save(saveSurveyResultInput)

    // Assert
    await expect(savePromise).rejects.toThrowError(InvalidSurveyAnswerError)
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

  it('should save the survey result on success', async () => {
    const { sut } = createSut()
    const saveSurveyResultInput = fakeSurveyResultInput()

    const savePromise = sut.save(saveSurveyResultInput)

    await expect(savePromise).resolves.toBeUndefined()
  })
})

type SutFactoryResponse = {
  sut: DbSaveSurveyResultUseCase
  createOrUpdateSurveyRepositoryStub: CreateOrUpdateSurveyResultRepository
  findSurveyByIdStub: FindSurveyByIdRepository
  loadAccountByIdStub: LoadAccountByIdRepository
}

const createSut = (): SutFactoryResponse => {
  const createOrUpdateSurveyResultRepositoryStub =
    makeCreateOrUpdateSurveyRepositoryStub()

  const findSurveyByIdStub = createMock<FindSurveyByIdRepository>({
    async findById() {
      return fakeSurvey()
    },
  })

  const loadAccountByIdStub = createMock<LoadAccountByIdRepository>({
    async loadById() {
      return fakeAccount()
    },
  })

  const sut = new DbSaveSurveyResultUseCase(
    createOrUpdateSurveyResultRepositoryStub,
    findSurveyByIdStub,
    loadAccountByIdStub
  )

  return {
    sut,
    createOrUpdateSurveyRepositoryStub:
      createOrUpdateSurveyResultRepositoryStub,
    findSurveyByIdStub,
    loadAccountByIdStub,
  }
}

const fakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  answers: [
    {
      answer: 'valid_answer',
    },
  ],
  createdAt: new Date(),
  question: 'any_question',
})

const fakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email',
  name: 'any_name',
  password: 'any_password',
  role: Role.User,
  accessToken: 'any_access_token',
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
  answer: 'valid_answer',
  surveyId: 'any_survey_id',
})
