import { SurveyModel } from '@/domain/models'
import {
  AddSurveyRepository,
  LoadSurveySummaryByIdRepository,
} from '@/data/protocols/db/survey-repository'
import { AddSurveyInput } from '@/data/use-cases/survey/add-survey/db-add-survey.use-case.protocols'
import { createMock } from '@golevelup/ts-jest'
import { FindSurveyByIdRepository } from '../protocols/db/survey-repository/find-survey-by-id.repository'
import { createLoadSurveySummaryStub, fakeSurvey } from '@/domain/test'

export const createAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(addSurveyInput: AddSurveyInput): Promise<SurveyModel> {
      return {
        id: 'any_id',
        ...addSurveyInput,
        createdAt: new Date(),
      }
    }
  }

  return new AddSurveyRepositoryStub()
}

export const createFindSurveyByIdRepositoryStub = () =>
  createMock<FindSurveyByIdRepository>({
    async findById() {
      return fakeSurvey()
    },
  })

export const createLoadSurveySummaryByIdRepositoryStub =
  (): LoadSurveySummaryByIdRepository =>
    createMock<LoadSurveySummaryByIdRepository>({
      loadSummaryById: async () => ({
        surveyId: 'survey_id',
        question: 'any_question',
        createdAt: new Date(2022, 0, 1),
        answers: [
          {
            answer: 'answer_1',
            image: 'image_1',
            count: 1,
            percent: 50,
          },
          {
            answer: 'answer_2',
            image: 'image_2',
            count: 1,
            percent: 50,
          },
        ],
      }),
    })
