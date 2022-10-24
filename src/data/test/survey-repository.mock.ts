import { SurveyModel } from '@/domain/models'
import { AddSurveyRepository } from '@/data/protocols/db/survey-repository'
import { AddSurveyInput } from '@/data/use-cases/survey/add-survey/db-add-survey.use-case.protocols'
import { createMock } from '@golevelup/ts-jest'
import { FindSurveyByIdRepository } from '../protocols/db/survey-repository/find-survey-by-id.repository'
import { fakeSurvey } from '@/domain/test'

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
