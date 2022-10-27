import { Schema } from 'swagger-schema-official'

export const surveysSchema: Schema = {
  type: 'object',
  properties: {
    surveys: {
      type: 'array',
      items: {
        $ref: '#/schemas/survey',
      },
    },
  },
}
