import { LoadSurveysUseCase } from '@/domain/use-cases/survey/list-surveys'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-repository/survey-mongo.repository'

export const createLoadAccountUseCase = (): LoadSurveysUseCase =>
  new SurveyMongoRepository()
