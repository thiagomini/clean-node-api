import { mongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import {
  clearAccountsCollection,
  clearSurveysCollection,
} from '@/infra/db/mongodb/helpers/test-teardown-helpers'
import { HttpStatusCodes } from '@/presentation/protocols'
import request from 'supertest'
import app from '../config/app'

describe('survey result routes', () => {
  afterAll(async () => {
    await clearSurveysCollection()
    await clearAccountsCollection()
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
  })
})
