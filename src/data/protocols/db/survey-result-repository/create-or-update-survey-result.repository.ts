import { SaveSurveyResultInput } from '@/domain/use-cases/save-survey-result'
import { SurveyResultModel } from '@/domain/models'

export interface CreateOrUpdateSurveyResultRepository {
  createOrUpdate(
    saveSurveyResultInput: SaveSurveyResultInput
  ): Promise<SurveyResultModel>
}
