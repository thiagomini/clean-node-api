import { AddSurveyInput } from '../../../../domain/use-cases/add-survey/add-survey.input'

export interface AddSurveyRepository {
  add(addSurveyInput: AddSurveyInput): Promise<void>
}
