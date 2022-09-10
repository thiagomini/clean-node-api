import { DbAddSurveyUseCase } from '../../../../data/use-cases/add-survey/db-add-survey.use-case'
import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey-repository/survey-mongo.repository'

export const createDbAddSurveyUseCase = (): DbAddSurveyUseCase => {
  const mongoSurveyRepository = new SurveyMongoRepository()

  return new DbAddSurveyUseCase(mongoSurveyRepository)
}
