import request from 'supertest'
import { mongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { clearAccountsCollection } from '../../infra/db/mongodb/helpers/test-teardown-helpers'
import { HttpStatusCodes } from '../../presentation/protocols'
import app from '../config/app'

beforeAll(async () => {
  await mongoHelper.connect(String(process.env.MONGO_URL))
})

beforeEach(async () => {
  await clearAccountsCollection()
})

afterAll(async () => {
  await mongoHelper.disconnect()
})

describe('signup routes', () => {
  describe('signup', () => {
    it('should return an account on success', async () => {
      await request(app).post('/api/signup').send({
        name: 'Thiago',
        email: 'thiago@mail.com',
        password: '123',
        passwordConfirmation: '123'
      }).expect(HttpStatusCodes.OK)
    })
  })
})
