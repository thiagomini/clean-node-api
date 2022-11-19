import { SaveSurveyResultUseCase } from '@/domain/use-cases/survey-result/save-survey-result'
import { DbSaveSurveyResultUseCase } from '@/data/use-cases/survey-result/save-survey-result'
import {
  AccountMongoRepository,
  SurveyMongoRepository,
  SurveyResultMongoRepository,
} from '@/infra/db/mongodb/repositories'

export const createSaveSurveyResultUseCase = (): SaveSurveyResultUseCase => {
  const createOrUpdateSurveyRepository = new SurveyResultMongoRepository()
  const findSurveyByIdRepository = new SurveyMongoRepository()
  const loadAccountByIdRepository = new AccountMongoRepository()

  return new DbSaveSurveyResultUseCase(
    createOrUpdateSurveyRepository,
    findSurveyByIdRepository,
    loadAccountByIdRepository
  )
}
