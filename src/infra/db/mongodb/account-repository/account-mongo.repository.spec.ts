import { mongoHelper } from '../helpers/mongo-helper'
import { clearAccountsCollection } from '../helpers/test-teardown-helpers'
import { AccountMongoRepository } from './account-mongo.repository'

describe('AccountMongoRepository', () => {
  beforeAll(async () => {
    await mongoHelper.connect(String(process.env.MONGO_URL))
  })

  beforeEach(async () => {
    await clearAccountsCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  describe('add', () => {
    it('should return an account on success', async () => {
      const sut = new AccountMongoRepository()

      const account = await sut.add({
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      })

      expect(account).toEqual({
        id: expect.any(String),
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      })
    })
  })

  describe('loadByEmail', () => {
    it('should return an account by email on success', async () => {
      // Arrange
      const sut = new AccountMongoRepository()
      const accountsCollection = await mongoHelper.getCollection('accounts')
      await accountsCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      })

      // Act
      const account = await sut.loadByEmail('valid_email@mail.com')

      // Assert
      expect(account).toEqual({
        id: expect.any(String),
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      })
    })
  })
})
