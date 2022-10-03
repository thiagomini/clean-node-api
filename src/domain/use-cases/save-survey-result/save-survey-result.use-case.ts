import { SaveSurveyResultInput } from './save-survey-result.input'

export interface SaveSurveyResultUseCase {
  save(surveyResultInput: SaveSurveyResultInput): Promise<void>
}
