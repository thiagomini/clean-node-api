import { mongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { HttpStatusCodes } from '@/presentation/protocols'
import request from 'supertest'
import { Role } from '@/auth'
import app from '../config/app'
import { AuthDSL } from '../dsl/auth/auth.dsl'
import { AUTH_HEADER } from '../../presentation/middlewares/auth-header-key'
import { clearSurveyResultCollection } from '../../infra/db/mongodb/helpers/test-teardown-helpers'
import { getSurveysCollection } from '../../infra/db/mongodb/helpers/collections'

describe('survey result routes', () => {
  const authDSL = AuthDSL.create()

  afterEach(async () => {
    await clearSurveyResultCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  describe('[PUT] /surveys/:surveyId', () => {
    it('should return 403 when user is not authenticated', async () => {
      await request(app)
        .put('/api/surveys/any_id')
        .send({
          answer: 'any_answer',
        })
        .expect(HttpStatusCodes.FORBIDDEN)
    })

    it('should return 204 when user is authenticated', async () => {
      const { insertedId: surveyId } = await (
        await getSurveysCollection()
      ).insertOne({
        answers: [
          {
            answer: 'any_answer',
          },
        ],
        createdAt: new Date(),
        question: 'any_question',
      })
      const { accessToken } = await authDSL.signupUser({
        role: Role.User,
      })

      await request(app)
        .put(`/api/surveys/${surveyId.toString()}`)
        .set(AUTH_HEADER, accessToken as string)
        .send({
          answer: 'any_answer',
        })
        .expect(HttpStatusCodes.NO_CONTENT)
    })
  })
})
