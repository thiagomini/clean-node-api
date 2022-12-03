import {
  clearAccountsCollection,
  clearSurveyResultCollection,
  clearSurveysCollection,
  mongoHelper,
} from '@/infra/db/mongodb/helpers'
import app from '@/main/config/app'
import { AUTH_HEADER } from '@/presentation/middlewares'
import { HttpStatusCodes } from '@/presentation/protocols'
import request from 'supertest'
import { AuthDSL } from '../../dsl/auth/auth.dsl'
import { SurveyDSL } from '../../dsl/survey/survey.dsl'
import { QueryBuilder } from '../query.builder'

describe('surveys e2e', () => {
  const queryBuilder = new QueryBuilder()
  const authDSL = AuthDSL.create()
  let surveyDSL: SurveyDSL

  let authenticatedUserToken: string

  beforeAll(async () => {
    surveyDSL = await SurveyDSL.create()
    await clearSurveysCollection()
    await clearSurveyResultCollection()
  })

  beforeEach(async () => {
    authenticatedUserToken = (await authDSL.signupUser()).accessToken as string
  })

  afterEach(async () => {
    await clearSurveysCollection()
    await clearAccountsCollection()
    await clearSurveyResultCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  it('should throw an error when the user is not authenticated', async () => {
    // Arrange
    const surveyId = await surveyDSL.createSurvey()
    const queryData = queryBuilder.surveySummary(surveyId)

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

  it('should return a survey summary on success', async () => {
    // Arrange
    const surveyId = await surveyDSL.createSurvey()
    const queryData = queryBuilder.surveySummary(surveyId)

    // Act
    const response = await request(app)
      .post('/graphql')
      .set(AUTH_HEADER, authenticatedUserToken)
      .send(queryData)
      .expect(HttpStatusCodes.OK)

    // Assert

    expect(response.body.errors).toBeUndefined()
    expect(response.body).toMatchObject({
      data: {
        surveySummary: {
          surveyId,
        },
      },
    })
  })
})
