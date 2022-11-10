import { Schema } from 'swagger-schema-official'

export const surveySummarySchema: Schema = {
  type: 'object',
  properties: {
    surveyId: {
      type: 'string',
    },
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
          count: {
            type: 'number',
          },
          percent: {
            type: 'number',
          },
        },
        required: ['answer', 'count', 'percent'],
      },
    },
  },
  required: ['surveyId', 'question', 'answers', 'createdAt'],
}
