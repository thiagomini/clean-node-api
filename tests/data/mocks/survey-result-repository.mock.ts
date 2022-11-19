import { SurveyResultModel } from '@/domain/models'
import { fakeSurveyResult } from '../../domain/mocks'
import { CreateOrUpdateSurveyResultRepository } from '@/data/protocols/db/survey-result-repository'

export const makeCreateOrUpdateSurveyRepositoryStub =
  (): CreateOrUpdateSurveyResultRepository => {
    class RepositoryStub implements CreateOrUpdateSurveyResultRepository {
      async createOrUpdate(): Promise<SurveyResultModel> {
        return fakeSurveyResult()
      }
    }

    return new RepositoryStub()
  }
