import { Collection } from 'mongodb'
import { mongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import { clearAccountsCollection } from '../../../infra/db/mongodb/helpers/test-teardown-helpers'
import { AuthDSL } from './auth.dsl'

describe('AuthDSL', () => {
  let accountsCollection: Collection

  beforeAll(async () => {
    accountsCollection = await mongoHelper.getCollection('accounts')
  })

  afterEach(async () => {
    await clearAccountsCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  describe('signupUser', () => {
    it('should create a new user in the database', async () => {
      const authDSL = AuthDSL.create()

      await authDSL.signupUser({
        email: 'mail@mail.com',
        password: '123',
        name: 'any_name'
      })

      const accountInDb = await accountsCollection.findOne({
        email: 'mail@mail.com'
      })

      expect(accountInDb).toBeDefined()
    })
  })
})
