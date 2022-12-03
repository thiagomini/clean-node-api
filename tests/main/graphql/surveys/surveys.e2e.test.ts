import {
  clearAccountsCollection,
  clearSurveysCollection,
  mongoHelper,
} from '@/infra/db/mongodb/helpers'
import app from '@/main/config/app'
import { HttpStatusCodes } from '@/presentation/protocols'
import validator from 'validator'
import request from 'supertest'
import { SurveyDSL } from '../../dsl/survey/survey.dsl'
import { QueryBuilder } from '../query.builder'
import { AuthDSL } from '../../dsl/auth/auth.dsl'
import { AUTH_HEADER } from '@/presentation/middlewares'

describe('surveys e2e', () => {
  const queryBuilder = new QueryBuilder()
  const authDSL = AuthDSL.create()
  let surveyDSL: SurveyDSL

  let authenticatedUserToken: string

  beforeAll(async () => {
    surveyDSL = await SurveyDSL.create()
    await clearSurveysCollection()
  })

  beforeEach(async () => {
    authenticatedUserToken = (await authDSL.signupUser()).accessToken as string
  })

  afterEach(async () => {
    await clearSurveysCollection()
    await clearAccountsCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  it('should throw an error when the user is not authenticated', async () => {
    // Arrange
    const queryData = queryBuilder.surveys()

    // Act
    const response = await request(app)
      .post('/graphql')
      .send(queryData)
      .expect(HttpStatusCodes.OK)

    // Assert
    expect(response.body.errors).toMatchObject([
      {
        extensions: {
          code: 'FORBIDDEN',
        },
        message: 'Access denied',
      },
    ])
    expect(response.body.data).toBeNull()
  })

  it('should return a list of surveys on success', async () => {
    // Arrange
    const existingSurveyId = await surveyDSL.createSurvey()
    const queryData = queryBuilder.surveys()

    // Act
    const response = await request(app)
      .post('/graphql')
      .set(AUTH_HEADER, authenticatedUserToken)
      .send(queryData)
      .expect(HttpStatusCodes.OK)

    // Assert
    const isIsoDate = (string: string): boolean =>
      validator.isISO8601(string, { strict: true, strictSeparator: true })

    expect(response.body.errors).toBeUndefined()
    expect(response.body).toMatchObject({
      data: {
        surveys: [
          {
            id: existingSurveyId,
            createdAt: expect.toSatisfy(isIsoDate),
          },
        ],
      },
    })
  })

  it('should return an empty array when there are no surveys', async () => {
    const queryData = queryBuilder.surveys()

    const response = await request(app)
      .post('/graphql')
      .set(AUTH_HEADER, authenticatedUserToken)
      .send(queryData)
      .expect(HttpStatusCodes.OK)

    expect(response.body.errors).toBeUndefined()
    expect(response.body).toMatchObject({
      data: {
        surveys: [],
      },
    })
  })
})
