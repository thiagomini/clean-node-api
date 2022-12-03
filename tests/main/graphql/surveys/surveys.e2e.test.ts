import { clearSurveysCollection, mongoHelper } from '@/infra/db/mongodb/helpers'
import app from '@/main/config/app'
import { HttpStatusCodes } from '@/presentation/protocols'
import request from 'supertest'
import { SurveyDSL } from '../../dsl/survey/survey.dsl'
import { QueryBuilder } from '../query.builder'

describe('surveys e2e', () => {
  const queryBuilder = new QueryBuilder()
  let surveyDSL: SurveyDSL

  beforeAll(async () => {
    surveyDSL = await SurveyDSL.create()
    await clearSurveysCollection()
  })

  afterEach(async () => {
    await clearSurveysCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  it('should return a list of surveys on success', async () => {
    const existingSurveyId = await surveyDSL.createSurvey()

    const queryData = queryBuilder.surveys()

    const response = await request(app)
      .post('/graphql')
      .send(queryData)
      .expect(HttpStatusCodes.OK)

    expect(response.body.errors).toBeUndefined()
    expect(response.body).toMatchObject({
      data: {
        surveys: [
          {
            id: existingSurveyId,
            createdAt: expect.any(String),
          },
        ],
      },
    })
  })

  it('should return an empty array when there are no surveys', async () => {
    const queryData = queryBuilder.surveys()

    const response = await request(app)
      .post('/graphql')
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
