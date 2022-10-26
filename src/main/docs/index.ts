import {
  badRequest,
  notFound,
  internalServerError,
  unauthorized,
} from './components'
import { loginPath } from './paths/login-path'
import { accountSchema, errorSchema, loginInputSchema } from './schemas'

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
    error: errorSchema,
  },
  components: {
    badRequest,
    unauthorized,
    internalServerError,
    notFound,
  },
}
