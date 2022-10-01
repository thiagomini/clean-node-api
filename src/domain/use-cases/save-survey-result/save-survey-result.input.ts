import { SurveyResultModel } from '../../models'

export interface SaveSurveyResultInput
  extends Pick<SurveyResultModel, 'accountId' | 'surveyId' | 'answer'> {}
