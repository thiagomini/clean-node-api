import request from 'supertest'
import { mongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { clearAccountsCollection } from '../../infra/db/mongodb/helpers/test-teardown-helpers'
import { HttpStatusCodes } from '../../presentation/protocols'
import app from '../config/app'
import { hash } from 'bcrypt'
import { Collection } from 'mongodb'

describe('auth routes', () => {
  let mongoAccountCollection: Collection

  beforeAll(async () => {
    mongoAccountCollection = await mongoHelper.getCollection('accounts')
  })

  beforeEach(async () => {
    await clearAccountsCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  describe('[POST] /signup', () => {
    it('should return 200 on signup', async () => {
      await request(app).post('/api/signup').send({
        name: 'Thiago',
        email: 'thiago@mail.com',
        password: '123',
        passwordConfirmation: '123'
      }).expect(HttpStatusCodes.OK)
    })
  })

  describe('[POST] /login', () => {
    it('should return 200 on login', async () => {
      await mongoAccountCollection.insertOne({
        name: 'thiago',
        email: 'thiago@mail.com',
        password: await hash('123', 12)
      })

      await request(app).post('/api/login').send({
        email: 'thiago@mail.com',
        password: '123'
      }).expect(HttpStatusCodes.OK)
    })
  })
})
