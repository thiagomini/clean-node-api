import { SurveyModel } from '@/domain/models'
import { AddSurveyInput } from '@/domain/use-cases/survey/add-survey'

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

export const createFakeSurveyInput = (): AddSurveyInput => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
})
