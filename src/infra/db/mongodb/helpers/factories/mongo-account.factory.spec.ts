import { ObjectId } from 'mongodb'
import { AccountModel } from '../../../../../domain/models'
import { mongoHelper } from '../mongo-helper'
import { MongoAccountFactory } from './mongo-account.factory'

describe('MongoAccountFactory', () => {
  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  describe('createFactory', () => {
    it('should return a new MongoAccountFactory', async () => {
      const factory = await MongoAccountFactory.createFactory()

      expect(factory).toBeInstanceOf(MongoAccountFactory)
    })
  })

  describe('createAccount', () => {
    it('should create an account with all given properties', async () => {
      // Arrange
      const sut = await MongoAccountFactory.createFactory()
      const accountData: AccountModel = {
        id: new ObjectId().toString(),
        accessToken: 'some_token',
        email: 'some_email',
        name: 'some_name',
        password: 'some_password'
      }

      // Act
      const createdAccount = await sut.createAccount(accountData)

      // Assert
      expect(createdAccount).toEqual(accountData)
    })
  })
})
