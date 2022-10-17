import { SaveSurveyResultUseCase } from '@/domain/use-cases/survey-result/save-survey-result'
import { DbSaveSurveyResultUseCase } from '@/data/use-cases/survey-result/save-survey-result/db-save-survey-result.use-case'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result-repository/survey-result-mongo.repository'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-repository/survey-mongo.repository'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository/account-mongo.repository'

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
