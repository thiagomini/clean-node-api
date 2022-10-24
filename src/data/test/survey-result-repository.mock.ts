import { fakeSurveyResult } from '@/domain/test'
import { SurveyResultModel } from '@/domain/models'
import { CreateOrUpdateSurveyResultRepository } from '../protocols/db/survey-result-repository'

export const makeCreateOrUpdateSurveyRepositoryStub =
  (): CreateOrUpdateSurveyResultRepository => {
    class RepositoryStub implements CreateOrUpdateSurveyResultRepository {
      async createOrUpdate(): Promise<SurveyResultModel> {
        return fakeSurveyResult()
      }
    }

    return new RepositoryStub()
  }
