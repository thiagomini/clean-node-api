import {
  clearAccountsCollection,
  mongoHelper,
} from '@/infra/db/mongodb/helpers'
import app from '@/main/config/app'
import { HttpStatusCodes } from '@/presentation/protocols'
import request from 'supertest'
import { MutationBuilder } from '../mutation-builder'

describe('signup e2e', () => {
  const mutationBuilder = new MutationBuilder()

  beforeEach(async () => {
    await clearAccountsCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  it('should return an accessToken on success', async () => {
    const mutationData = mutationBuilder.signupUser({
      name: 'any_name',
      email: 'valid@mail.com',
      password: '123',
      passwordConfirmation: '123',
    })

    const response = await request(app)
      .post('/graphql')
      .send(mutationData)
      .expect(HttpStatusCodes.OK)

    expect(response.body.errors).toBeUndefined()
    expect(response.body).toMatchObject({
      data: {
        signUp: {
          accessToken: expect.any(String),
        },
      },
    })
  })
})
