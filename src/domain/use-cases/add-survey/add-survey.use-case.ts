import { AddSurveyInput } from './add-survey.input'

export interface AddSurveyUseCase {
  add(surveyInput: AddSurveyInput): Promise<void>
}
