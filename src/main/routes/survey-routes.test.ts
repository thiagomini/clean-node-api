import request from 'supertest'
import { mongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { clearSurveysCollection } from '../../infra/db/mongodb/helpers/test-teardown-helpers'
import { HttpStatusCodes } from '../../presentation/protocols'
import app from '../config/app'
import { AUTH_HEADER } from '../../presentation/middlewares/auth-header-key'

describe('survey routes', () => {
  afterAll(async () => {
    await clearSurveysCollection()
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
  })
})
