export interface SurveySchema {
  question: string
  answers: Array<{
    image?: string
    answer: string
  }>
  createdAt: Date
}
