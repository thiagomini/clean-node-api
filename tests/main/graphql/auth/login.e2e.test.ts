import request from 'supertest'
import app from '@/main/config/app'
import {
  clearAccountsCollection,
  mongoHelper,
} from '@/infra/db/mongodb/helpers'
import { AuthDSL } from '../../dsl/auth/auth.dsl'
import { HttpStatusCodes } from '@/presentation/protocols'
import { QueryBuilder } from '../query.builder'

describe('login e2e', () => {
  const authDSL = AuthDSL.create()

  const queryBuilder = new QueryBuilder()

  beforeEach(async () => {
    await clearAccountsCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  it('should return 200 with users token on success', async () => {
    const existingUser = await authDSL.signupUser({
      password: '123',
    })

    const queryData = queryBuilder.loginUser({
      email: existingUser.email,
      password: '123',
    })

    const response = await request(app)
      .post('/graphql')
      .send(queryData)
      .expect(HttpStatusCodes.OK)

    expect(response.body.errors).toBeUndefined()
    expect(response.body).toMatchObject({
      data: {
        login: {
          accessToken: expect.any(String),
        },
      },
    })
  })
})
