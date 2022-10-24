import { SurveyModel } from '@/domain/models'

export const fakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  answers: [
    {
      answer: 'valid_answer',
    },
  ],
  createdAt: new Date(2022, 0, 1),
  question: 'any_question',
})
