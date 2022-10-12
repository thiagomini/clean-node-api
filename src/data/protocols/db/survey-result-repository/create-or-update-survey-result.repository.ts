import { SaveSurveyResultInput } from '@/domain/use-cases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models'
import { Optional } from '@/utils'

export interface CreateOrUpdateSurveyResultRepository {
  createOrUpdate(
    saveSurveyResultInput: SaveSurveyResultInput
  ): Promise<Optional<SurveyResultModel>>
}
