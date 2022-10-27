import {
  badRequest,
  notFound,
  internalServerError,
  forbidden,
} from './components'
import { unauthorized } from './components/unauthorized.component'
import { surveyPath, loginPath } from './paths'
import {
  accountSchema,
  errorSchema,
  loginInputSchema,
  surveysSchema,
} from './schemas'
import { surveySchema } from './schemas/survey.schema'

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
    {
      name: 'Surveys',
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
    survey: surveySchema,
  },
  components: {
    badRequest,
    forbidden,
    unauthorized,
    internalServerError,
    notFound,
  },
}
