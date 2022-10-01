import { FindSurveyByIdRepository } from '../../protocols/db/survey-repository/find-survey-by-id.repository'
import { SurveyModel } from '../add-survey/db-add-survey.use-case.protocols'
import { DbFindSurveyByIdUseCase } from './db-find-survey-by-id.use-case'

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
