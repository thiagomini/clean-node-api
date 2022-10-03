import { SaveSurveyResultInput } from '@/domain/use-cases/save-survey-result'

export interface CreateOrUpdateSurveyResultRepository {
  createOrUpdate(saveSurveyResultInput: SaveSurveyResultInput): Promise<void>
}
