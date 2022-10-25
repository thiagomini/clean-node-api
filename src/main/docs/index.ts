import { loginPath } from './paths/login-path'
import { accountSchema } from './schemas/account.schema'
import { loginInputSchema } from './schemas/login-input.schema'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description:
      'API do curso do Mango para realizar enquetes entre programadores',
    version: '1.0.0',
  },
  servers: [{ url: '/api' }],
  tags: [
    {
      name: 'Login',
    },
  ],
  paths: {
    '/login': loginPath,
  },
  schemas: {
    account: accountSchema,
    loginInput: loginInputSchema,
  },
}
