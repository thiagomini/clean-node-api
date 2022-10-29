import { ModelAttributes, SurveyModel } from '@/domain/models'
import { ModelDefaultAttributesFactory } from './interfaces'

export class MongoSurveyDefaultAttributesFactory
  implements ModelDefaultAttributesFactory<SurveyModel>
{
  defaultAttributes(): ModelAttributes<SurveyModel> {
    return {
      createdAt: new Date(),
      question: 'any_question',
      answers: [
        {
          answer: 'answer_1',
          image: 'image',
        },
        {
          answer: 'answer_2',
          image: 'image_2',
        },
      ],
    }
  }
}
