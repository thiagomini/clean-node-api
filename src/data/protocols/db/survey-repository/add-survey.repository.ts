import { SurveyModel } from '@/domain/models'
import { AddSurveyInput } from '@/domain/use-cases/survey/add-survey/add-survey.input'

export interface AddSurveyRepository {
  add(addSurveyInput: AddSurveyInput): Promise<SurveyModel>
}
