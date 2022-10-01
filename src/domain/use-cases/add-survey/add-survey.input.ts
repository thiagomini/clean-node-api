import { SurveyModel } from '../../models'

export interface SurveyAnswerInput {
  answer: string
  image?: string
}

export interface AddSurveyInput
  extends Pick<SurveyModel, 'question' | 'answers'> {}
