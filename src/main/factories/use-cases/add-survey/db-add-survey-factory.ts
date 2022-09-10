import { DbAddSurveyUseCase } from '../../../../data/use-cases/add-survey/db-add-survey.use-case'
import { getSurveysCollection } from '../../../../infra/db/mongodb/helpers/collections'
import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey-repository/survey-mongo.repository'

export const createDbAddSurveyUseCase = async (): Promise<DbAddSurveyUseCase> => {
  const surveysCollection = await getSurveysCollection()
  const mongoSurveyRepository = new SurveyMongoRepository(surveysCollection)

  return new DbAddSurveyUseCase(mongoSurveyRepository)
}
