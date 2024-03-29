import { Schema } from 'swagger-schema-official'

export const surveySchema: Schema = {
  type: 'object',
  properties: {
    question: {
      type: 'string',
    },
    answers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            description: 'The image url',
          },
          answer: {
            type: 'string',
          },
        },
        required: ['answer'],
      },
    },
  },
  required: ['question', 'answers'],
}
