import { faker } from '@faker-js/faker'
import { AddSurveyInput } from '@/domain/use-cases/survey/add-survey'

export function buildSurveyInput(
  partial: Partial<AddSurveyInput> = {}
): AddSurveyInput {
  const defaultAttributes: AddSurveyInput = {
    answers: [
      {
        answer: faker.lorem.word(),
        image: faker.image.imageUrl(),
      },
    ],
    question: faker.lorem.word(),
  }

  return Object.assign(defaultAttributes, partial)
}
