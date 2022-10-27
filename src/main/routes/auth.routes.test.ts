import request from 'supertest'
import { mongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { clearAccountsCollection } from '@/infra/db/mongodb/helpers/test-teardown-helpers'
import { HttpStatusCodes } from '@/presentation/protocols'
import app from '../config/app'
import { AuthDSL } from '../dsl/auth/auth.dsl'

describe('auth routes', () => {
  const authDSL = AuthDSL.create()

  beforeEach(async () => {
    await clearAccountsCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  describe('[POST] /signup', () => {
    it('should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Thiago',
          email: 'thiago@mail.com',
          password: '123',
          passwordConfirmation: '123',
        })
        .expect(HttpStatusCodes.OK)
    })

    it('should return 400 when password and confirmation dont match', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Thiago',
          email: 'thiago@mail.com',
          password: '123',
          passwordConfirmation: '1234',
        })
        .expect(HttpStatusCodes.BAD_REQUEST)
    })
  })

  describe('[POST] /login', () => {
    it('should return 200 on login success', async () => {
      await authDSL.signupUser({
        name: 'thiago',
        email: 'thiago@mail.com',
        password: '123',
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'thiago@mail.com',
          password: '123',
        })
        .expect(HttpStatusCodes.OK)
    })

    it('should return 401 when user email does not exist', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'thiago@mail.com',
          password: '123',
        })
        .expect(HttpStatusCodes.UNAUTHORIZED)
    })
  })
})
