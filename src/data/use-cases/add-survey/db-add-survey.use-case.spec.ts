import { AddSurveyInput, AddSurveyRepository, SurveyModel } from './db-add-survey.use-case.protocols'
import { DbAddSurveyUseCase } from './db-add-survey.use-case'
import { AddSurveyUseCaseError } from './add-survey.use-case.error'

describe('DbAddSurveyUseCase', () => {
  it('should call AddSurveyRepository with correct values', async () => {
    // Arrange
    const { sut, addSurveyRepositoryStub } = createSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const addSurveyInput = createFakeSurveyInput()

    // Act
    await sut.add(addSurveyInput)

    // Assert
    expect(addSpy).toHaveBeenCalledWith(addSurveyInput)
  })
})

it('should throw a AddSurveyUseCaseError if the repository throws', async () => {
  // Arrange
  const { sut, addSurveyRepositoryStub } = createSut()
  jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValueOnce(new Error())
  const addSurveyInput = createFakeSurveyInput()

  // Act
  const addPromise = sut.add(addSurveyInput)

  // Assert
  await expect(addPromise).rejects.toThrowError(AddSurveyUseCaseError)
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
    async add (addSurveyInput: AddSurveyInput): Promise<SurveyModel> {
      return {
        id: 'any_id',
        ...addSurveyInput
      }
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
