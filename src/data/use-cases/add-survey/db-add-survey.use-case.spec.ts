import { AddSurveyInput, AddSurveyRepository } from './db-add-survey.use-case.protocols'
import { DbAddSurveyUseCase } from './db-add-survey.use-case'

describe('DbAddSurveyUseCase', () => {
  it('should call AddSurveyRepository with correct values', async () => {
    // Arrange
    const { sut, addSurveyRepositoryStub } = createSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const addSurveyInput = createFakeSurveyInput()

    // Act
    await sut.add(addSurveyInput)

    expect(addSpy).toHaveBeenCalledWith(addSurveyInput)
  })
})

interface SutFactoryResponse {
  sut: DbAddSurveyUseCase
  addSurveyRepositoryStub: AddSurveyRepository
}

const createSut = (): SutFactoryResponse => {
  const addSurveyRepositoryStub = createAddSurveyRepositoryStub()
  const sut = new DbAddSurveyUseCase(addSurveyRepositoryStub)

  return {
    sut,
    addSurveyRepositoryStub
  }
}

const createAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    public async add (): Promise<void> {

    }
  }

  return new AddSurveyRepositoryStub()
}

const createFakeSurveyInput = (): AddSurveyInput => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})
