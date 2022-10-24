import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultInput } from '@/domain/use-cases/survey-result/save-survey-result'

export const fakeSurveyResult = async (): Promise<SurveyResultModel> => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  createdAt: new Date(),
  id: 'any_id',
})

export const fakeSurveyResultInput = (): SaveSurveyResultInput => ({
  accountId: 'any_id',
  answer: 'valid_answer',
  surveyId: 'any_survey_id',
})
