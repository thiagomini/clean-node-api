import { Role } from '@/auth'
import { mongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import {
  clearAccountsCollection,
  clearSurveysCollection,
} from '@/infra/db/mongodb/helpers/test-teardown-helpers'
import { AUTH_HEADER } from '@/presentation/middlewares/auth-header-key'
import { HttpStatusCodes } from '@/presentation/protocols'
import request from 'supertest'
import app from '../config/app'
import { AuthDSL } from '../dsl/auth/auth.dsl'

describe('survey routes', () => {
  const authDSL = AuthDSL.create()

  afterAll(async () => {
    await clearSurveysCollection()
    await clearAccountsCollection()
    await mongoHelper.disconnect()
  })

  describe('[POST] /surveys', () => {
    it('should return 403 when user is not authenticated', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any_question',
          answers: [
            {
              image: 'https://loremflickr.com/640/480/cats',
              answer: 'any_answer',
            },
            {
              answer: 'any_answer_2',
            },
          ],
        })
        .expect(HttpStatusCodes.FORBIDDEN)
    })

    it('should return 403 when user token is invalid', async () => {
      await request(app)
        .post('/api/surveys')
        .set(AUTH_HEADER, 'invalid_token')
        .send({
          question: 'any_question',
          answers: [
            {
              image: 'https://loremflickr.com/640/480/cats',
              answer: 'any_answer',
            },
            {
              answer: 'any_answer_2',
            },
          ],
        })
        .expect(HttpStatusCodes.FORBIDDEN)
    })

    it('should return 403 when user is not an Admin', async () => {
      const { accessToken } = await authDSL.signupUser({
        role: Role.User,
      })

      await request(app)
        .post('/api/surveys')
        .set(AUTH_HEADER, accessToken as string)
        .send({
          question: 'any_question',
          answers: [
            {
              image: 'https://loremflickr.com/640/480/cats',
              answer: 'any_answer',
            },
            {
              answer: 'any_answer_2',
            },
          ],
        })
        .expect(HttpStatusCodes.FORBIDDEN)
    })

    it('should return 204 when user is authenticated as an Admin', async () => {
      const user = await authDSL.signupUser({
        role: Role.Admin,
      })
      const accessToken = user.accessToken as string

      await request(app)
        .post('/api/surveys')
        .set(AUTH_HEADER, accessToken)
        .send({
          question: 'any_question',
          answers: [
            {
              image: 'https://loremflickr.com/640/480/cats',
              answer: 'any_answer',
            },
            {
              answer: 'any_answer_2',
            },
          ],
        })
        .expect(HttpStatusCodes.NO_CONTENT)
    })
  })

  describe('[GET] /surveys', () => {
    it('should return 403 when user is not authenticated', async () => {
      await request(app)
        .get('/api/surveys')
        .send()
        .expect(HttpStatusCodes.FORBIDDEN)
    })

    it('should return 403 when user token is invalid', async () => {
      await request(app)
        .get('/api/surveys')
        .set(AUTH_HEADER, 'invalid_token')
        .expect(HttpStatusCodes.FORBIDDEN)
    })

    it('should return 200 when user is authenticated as an Admin', async () => {
      const user = await authDSL.signupUser({
        role: Role.Admin,
      })
      const accessToken = user.accessToken as string

      await request(app)
        .get('/api/surveys')
        .set(AUTH_HEADER, accessToken)
        .send()
        .expect(HttpStatusCodes.OK)
    })

    it('should return 200 when user is authenticated as a normal User', async () => {
      const user = await authDSL.signupUser({
        role: Role.User,
      })
      const accessToken = user.accessToken as string

      await request(app)
        .get('/api/surveys')
        .set(AUTH_HEADER, accessToken)
        .send()
        .expect(HttpStatusCodes.OK)
    })
  })
})
