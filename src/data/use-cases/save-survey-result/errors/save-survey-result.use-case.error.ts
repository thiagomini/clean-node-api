import { ContextError, ContextErrorInput } from '@/errors'
import { SaveSurveyResultInput } from '../db-save-survey-result.protocols'

export interface SaveSurveyResultErrorInput
  extends Pick<ContextErrorInput, 'cause'> {
  saveSurveyResultInput: SaveSurveyResultInput
}

export class SaveSurveyResultUseCaseError extends ContextError {
  constructor(errorInput: SaveSurveyResultErrorInput) {
    const { saveSurveyResultInput } = errorInput
    super({
      message: `An Error occurred while trying to save a result for survey with id ${saveSurveyResultInput.surveyId}`,
      errorName: SaveSurveyResultUseCaseError.name,
      context: {
        saveSurveyResultInput,
      },
    })
  }
}
