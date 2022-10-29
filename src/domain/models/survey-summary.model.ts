export interface SurveySummaryModel {
  surveyId: string
  question: string
  answers: SurveyAnswerSummaryModel[]
  date: Date
}

export interface SurveyAnswerSummaryModel {
  image?: string
  answer: string
  count: number
  percent: number
}
