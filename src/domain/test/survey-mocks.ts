import { SurveyModel } from '@/domain/models'

export const fakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  answers: [
    {
      answer: 'valid_answer',
    },
  ],
  createdAt: new Date(),
  question: 'any_question',
})
