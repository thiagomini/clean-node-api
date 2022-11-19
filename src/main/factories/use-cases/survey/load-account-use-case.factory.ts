import { LoadSurveysUseCase } from '@/domain/use-cases/survey/list-surveys'
import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories/survey-mongo.repository'

export const createLoadAccountUseCase = (): LoadSurveysUseCase =>
  new SurveyMongoRepository()
