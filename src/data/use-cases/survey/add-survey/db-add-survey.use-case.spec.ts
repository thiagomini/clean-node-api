import {
  AddSurveyInput,
  AddSurveyRepository,
} from './db-add-survey.use-case.protocols'
import { DbAddSurveyUseCase } from './db-add-survey.use-case'
import { AddSurveyUseCaseError } from './add-survey.use-case.error'
import { createAddSurveyRepositoryStub } from '@/data/test'
import { createFakeSurveyInput } from '@/domain/test'

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

type SutFactoryResponse = {
  sut: DbAddSurveyUseCase
  addSurveyRepositoryStub: AddSurveyRepository
}

const createSut = (): SutFactoryResponse => {
  const addSurveyRepositoryStub = createAddSurveyRepositoryStub()
  const sut = new DbAddSurveyUseCase(addSurveyRepositoryStub)

  return {
    sut,
    addSurveyRepositoryStub,
  }
}
