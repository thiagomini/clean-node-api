import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories/survey-mongo.repository'
import { DbLoadSurveySummaryUseCase } from '@/data/use-cases/survey/load-survey-summary/db-load-survey-summary.use-case'
import { LoadSurveySummaryUseCase } from '@/domain/use-cases/survey/load-survey-summary'

export const createLoadSurveySummaryUseCase = (): LoadSurveySummaryUseCase => {
  const surveyRepository = new SurveyMongoRepository()
  return new DbLoadSurveySummaryUseCase(surveyRepository)
}
