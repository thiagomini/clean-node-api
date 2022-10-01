import { FindSurveyByIdRepository } from '../../protocols/db/survey-repository/find-survey-by-id.repository'
import { SurveyModel } from '../add-survey/db-add-survey.use-case.protocols'
import { DbFindSurveyByIdUseCase } from './db-find-survey-by-id.use-case'
import { FindSurveyByIdUseCaseError } from './find-survey-by-id.use-case.error'
import { SurveyNotFoundError } from './survey-not-found.error'

describe('DbFindSurveyByIdUseCase', () => {
  const FAKE_ID = 'fake_id'

  describe('findById', () => {
    it('should call FindSurveyByIdRepository with correct id', async () => {
      // Arrange
      const { sut, findSurveyByIdRepositoryStub } = createSut()
      const findByIdSpy = jest.spyOn(findSurveyByIdRepositoryStub, 'findById')

      // Act
      await sut.findById(FAKE_ID)

      // Assert
      expect(findByIdSpy).toHaveBeenCalledWith(FAKE_ID)
    })

    it('should throw a FindSurveyByIdUseCaseError when FindSurveyByIdRepository throws an unexpected error', async () => {
      // Arrange
      const { sut, findSurveyByIdRepositoryStub } = createSut()
      jest
        .spyOn(findSurveyByIdRepositoryStub, 'findById')
        .mockRejectedValueOnce(new Error('Unexpected error'))

      // Act
      const surveyPromise = sut.findById(FAKE_ID)

      // Assert
      await expect(surveyPromise).rejects.toThrowError(
        FindSurveyByIdUseCaseError
      )
    })

    it('should throw a SurveyNotFoundError when FindSurveyByIdRepository returns undefined', async () => {
      // Arrange
      const { sut, findSurveyByIdRepositoryStub } = createSut()
      jest
        .spyOn(findSurveyByIdRepositoryStub, 'findById')
        .mockResolvedValueOnce(undefined)

      // Act
      const surveyPromise = sut.findById(FAKE_ID)

      // Assert
      await expect(surveyPromise).rejects.toThrowError(SurveyNotFoundError)
    })

    it('should return a SurveyModel on success', async () => {
      // Arrange
      const { sut } = createSut()

      // Act
      const survey = await sut.findById(FAKE_ID)

      // Assert
      expect(survey).toEqual(fakeSurvey())
    })
  })
})

type SutFactoryResponse = {
  sut: DbFindSurveyByIdUseCase
  findSurveyByIdRepositoryStub: FindSurveyByIdRepository
}

const createSut = (): SutFactoryResponse => {
  const findSurveyByIdRepositoryStub = createFindSurveyByIdRepositoryStub()
  const sut = new DbFindSurveyByIdUseCase(findSurveyByIdRepositoryStub)

  return {
    sut,
    findSurveyByIdRepositoryStub,
  }
}

const createFindSurveyByIdRepositoryStub = (): FindSurveyByIdRepository => {
  class FindSurveyByIdRepositoryStub implements FindSurveyByIdRepository {
    async findById(): Promise<SurveyModel> {
      return fakeSurvey()
    }
  }

  return new FindSurveyByIdRepositoryStub()
}

const fakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  answers: [],
  createdAt: new Date(2022, 0, 1),
  question: 'any_question',
})
