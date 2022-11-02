import { SurveySchema } from '../../schemas'
import { ModelDefaultAttributesFactory } from './interfaces'

export class MongoSurveyDefaultAttributesFactory
  implements ModelDefaultAttributesFactory<SurveySchema>
{
  defaultAttributes(): SurveySchema {
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
