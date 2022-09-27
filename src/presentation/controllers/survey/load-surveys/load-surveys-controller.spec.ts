import { LoadSurveysController } from './load-surveys-controller'
import {
  internalServerError,
  LoadSurveysUseCase,
  ok,
  SurveyModel,
} from './load-surveys.protocols'

describe('LoadSurveysController', () => {
  it('should call LoadSurveysUseCase', async () => {
    // Arrange
    const { sut, loadSurveysStub } = createSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'list')

    // Act
    await sut.handle()

    // Assert
    expect(loadSpy).toHaveBeenCalledTimes(1)
  })

  it('should return 500 if LoadSurveysUseCase fails', async () => {
    // Arrange
    const { sut, loadSurveysStub } = createSut()
    jest.spyOn(loadSurveysStub, 'list').mockRejectedValueOnce(new Error())

    // Act
    const httpResponse = await sut.handle()

    // Assert
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })

  it('return 200 with surveys data on success', async () => {
    // Arrange
    const { sut } = createSut()

    // Act
    const httpResponse = await sut.handle()

    // Assert
    expect(httpResponse).toEqual(
      ok({
        surveys: [fakeSurvey()],
      })
    )
  })
})

interface SutFactoryResponse {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveysUseCase
}

const createSut = (): SutFactoryResponse => {
  const loadSurveysStub = createLoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)

  return {
    sut,
    loadSurveysStub,
  }
}

const createLoadSurveysStub = (): LoadSurveysUseCase => {
  class LoadSurveysStub implements LoadSurveysUseCase {
    public async list(): Promise<SurveyModel[]> {
      return [fakeSurvey()]
    }
  }
  const loadSurveyStub = new LoadSurveysStub()
  return loadSurveyStub
}

const fakeSurvey = (): SurveyModel => ({
  id: 'valid_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  createdAt: new Date(),
})
