import { SurveyModel } from '@/domain/models'
import {
  AddSurveyInput,
  AddSurveyUseCase,
} from '@/domain/use-cases/survey/add-survey'
import { LoadSurveysUseCase } from '@/domain/use-cases/survey/list-surveys'

export const fakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  answers: [
    {
      answer: 'valid_answer',
    },
  ],
  createdAt: new Date(2022, 0, 1),
  question: 'any_question',
})

export const createFakeSurveyInput = (): AddSurveyInput => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
})

export const createAddSurveyStub = (): AddSurveyUseCase => {
  class AddSurveyStub implements AddSurveyUseCase {
    async add(): Promise<void> {}
  }

  return new AddSurveyStub()
}

export const createLoadSurveysStub = (): LoadSurveysUseCase => {
  class LoadSurveysStub implements LoadSurveysUseCase {
    public async list(): Promise<SurveyModel[]> {
      return [fakeSurvey()]
    }
  }
  const loadSurveyStub = new LoadSurveysStub()
  return loadSurveyStub
}
