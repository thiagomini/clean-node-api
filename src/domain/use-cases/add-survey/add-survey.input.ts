
export interface SurveyAnswerInput {
  answer: string
  image: string
}

export interface AddSurveyInput {
  question: string
  answers: SurveyAnswerInput[]
}
