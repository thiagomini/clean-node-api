import type { Schema } from 'swagger-schema-official'

export const signUpInputSchema: Schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    passwordConfirmation: {
      type: 'string',
    },
  },
  required: ['name', 'email', 'password', 'passwordConfirmation'],
}
