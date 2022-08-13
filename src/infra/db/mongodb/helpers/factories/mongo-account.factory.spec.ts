import { ObjectId } from 'mongodb'
import { AccountModel } from '../../../../../domain/models'
import { mongoHelper } from '../mongo-helper'
import { clearAccountsCollection } from '../test-teardown-helpers'
import { MongoAccountFactory } from './mongo-account.factory'

describe('MongoAccountFactory', () => {
  afterAll(async () => {
    await clearAccountsCollection()
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

    it('should create an account with all default properties', async () => {
      // Arrange
      const sut = await MongoAccountFactory.createFactory()

      // Act
      const createdAccount = await sut.createAccount()

      // Assert
      expect(createdAccount).toEqual<AccountModel>({
        id: expect.any(String),
        email: expect.any(String),
        name: expect.any(String),
        password: expect.any(String),
        accessToken: expect.any(String)
      })
    })

    it('should create an account with all properties but id', async () => {
      // Arrange
      const sut = await MongoAccountFactory.createFactory()
      const accountData: Partial<AccountModel> = {
        accessToken: 'some_token',
        email: 'some_email',
        name: 'some_name',
        password: 'some_password'
      }

      // Act
      const createdAccount = await sut.createAccount(accountData)

      // Assert
      expect(createdAccount).toEqual({
        ...accountData,
        id: expect.any(String)
      })
    })
  })
})
