import { SaveSurveyResultInput } from './save-survey-result.input'

export interface SaveSurveyResultUseCase {
  /**
   * Saves a survey result or updates it if already exists.
   * @throws {NonexistentSurveyError} when the survey does not exist.
   * @throws {NonexistentAccountError} when the account does not exist.
   */
  save(surveyResultInput: SaveSurveyResultInput): Promise<void>
}
