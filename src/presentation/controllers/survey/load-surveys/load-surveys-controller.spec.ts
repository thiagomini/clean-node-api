import { internalServerError } from '../../../utils/http-responses-factories'
import { LoadSurveysController } from './load-surveys-controller'
import {
  HttpRequest,
  LoadSurveysUseCase,
  SurveyModel,
} from './load-surveys.protocols'

describe('LoadSurveysController', () => {
  it('should call LoadSurveysUseCase', async () => {
    // Arrange
    const { sut, loadSurveysStub } = createSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')

    // Act
    await sut.handle(fakeRequest())

    // Assert
    expect(loadSpy).toHaveBeenCalledTimes(1)
  })

  it('should return 500 if LoadSurveysUseCase fails', async () => {
    // Arrange
    const { sut, loadSurveysStub } = createSut()
    jest.spyOn(loadSurveysStub, 'load').mockRejectedValueOnce(new Error())

    // Act
    const httpResponse = await sut.handle(fakeRequest())

    // Assert
    expect(httpResponse).toEqual(internalServerError(new Error()))
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
    public async load(): Promise<SurveyModel[]> {
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

const fakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
  },
})
