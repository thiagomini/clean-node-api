import {
  badRequest,
  notFound,
  internalServerError,
  unauthorized,
} from './components'
import { surveyPath, loginPath } from './paths'
import {
  accountSchema,
  errorSchema,
  loginInputSchema,
  surveysSchema,
} from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description:
      'API do curso do Mango para realizar enquetes entre programadores',
    version: '1.0.0',
  },
  license: {
    name: 'ISC',
    url: 'https://opensource.org/licenses/ISC',
  },
  servers: [{ url: '/api' }],
  tags: [
    {
      name: 'Login',
    },
  ],
  paths: {
    '/login': loginPath,
    '/surveys': surveyPath,
  },
  schemas: {
    account: accountSchema,
    loginInput: loginInputSchema,
    error: errorSchema,
    surveys: surveysSchema,
  },
  components: {
    badRequest,
    unauthorized,
    internalServerError,
    notFound,
  },
}
