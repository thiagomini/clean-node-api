import type { Schema } from 'swagger-schema-official'

export const loginInputSchema: Schema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
  required: ['email', 'password'],
}
