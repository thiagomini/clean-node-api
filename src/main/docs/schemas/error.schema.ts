import { Schema } from 'swagger-schema-official'

export const errorSchema: Schema = {
  type: 'object',
  properties: {
    error: {
      type: 'string',
    },
  },
}
