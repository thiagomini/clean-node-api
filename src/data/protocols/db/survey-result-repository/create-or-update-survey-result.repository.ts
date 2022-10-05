import { SaveSurveyResultInput } from '@/domain/use-cases/save-survey-result'

export interface CreateOrUpdateSurveyResultRepository {
  createOrUpdateResult(
    saveSurveyResultInput: SaveSurveyResultInput
  ): Promise<void>
}
