import { Schema } from 'swagger-schema-official'

export const surveyResultInputSchema: Schema = {
  type: 'object',
  properties: {
    answer: {
      type: 'string',
    },
  },
  required: ['answer'],
}
