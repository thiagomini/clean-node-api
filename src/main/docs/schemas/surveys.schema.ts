import { Schema } from 'swagger-schema-official'

export const surveysSchema: Schema = {
  type: 'object',
  properties: {
    surveys: {
      type: 'array',
      items: {
        allOf: [
          {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
            },
          },
          {
            $ref: '#/schemas/survey',
          },
          {
            type: 'object',
            properties: {
              createdAt: {
                type: 'string',
                description: 'Date in ISO Format (YYYY-MM-DD HH:mm:ss.SSSZ)',
              },
            },
          },
        ],
      },
    },
  },
}
