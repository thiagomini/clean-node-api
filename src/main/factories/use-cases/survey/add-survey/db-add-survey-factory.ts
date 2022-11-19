import { DbAddSurveyUseCase } from '@/data/use-cases/survey/add-survey/db-add-survey.use-case'
import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories/survey-mongo.repository'

export const createDbAddSurveyUseCase = (): DbAddSurveyUseCase => {
  const mongoSurveyRepository = new SurveyMongoRepository()

  return new DbAddSurveyUseCase(mongoSurveyRepository)
}
