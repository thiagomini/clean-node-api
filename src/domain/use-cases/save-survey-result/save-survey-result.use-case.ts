import { SaveSurveyResultInput } from './save-survey-result.input'

export interface SaveSurveyResult {
  save(surveyResultInput: SaveSurveyResultInput): Promise<void>
}
