export interface SurveySummaryModel {
  surveyId: string
  question: string
  answers: SurveyAnswerSummaryModel[]
  createdAt: Date
}

export interface SurveyAnswerSummaryModel {
  image?: string
  answer: string
  count: number
  percent: number
}
