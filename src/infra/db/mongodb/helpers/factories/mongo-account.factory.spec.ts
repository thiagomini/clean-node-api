import { Collection, ObjectId } from 'mongodb'
import { Role } from '../../../../../auth'
import { AccountModel } from '../../../../../domain/models'
import { DocumentWithMongoId } from '../mongo-document-helper'
import { mongoHelper } from '../mongo-helper'
import { clearAccountsCollection } from '../test-teardown-helpers'
import { MongoAccountFactory } from './mongo-account.factory'

describe('MongoAccountFactory', () => {
  let accountCollection: Collection<DocumentWithMongoId<AccountModel>>

  beforeAll(async () => {
    await mongoHelper.connect()
    accountCollection = await mongoHelper.getCollection('accounts')
  })

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
    it('should return an account with all given properties', async () => {
      // Arrange
      const sut = await MongoAccountFactory.createFactory()
      const accountData: AccountModel = {
        id: new ObjectId().toString(),
        accessToken: 'some_token',
        email: 'some_email',
        name: 'some_name',
        password: 'some_password',
        role: Role.User,
      }

      // Act
      const createdAccount = await sut.createAccount(accountData)

      // Assert
      expect(createdAccount).toEqual(accountData)
    })

    it('should return an account with all default properties', async () => {
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
        accessToken: expect.any(String),
        role: Role.User,
      })
    })

    it('should return an account with all properties but id', async () => {
      // Arrange
      const sut = await MongoAccountFactory.createFactory()
      const accountData: Partial<AccountModel> = {
        accessToken: 'some_token',
        email: 'some_email',
        name: 'some_name',
        password: 'some_password',
        role: Role.User,
      }

      // Act
      const createdAccount = await sut.createAccount(accountData)

      // Assert
      expect(createdAccount).toEqual({
        ...accountData,
        id: expect.any(String),
      })
    })

    it('should be able to create the account in the database', async () => {
      // Arrange
      const sut = await MongoAccountFactory.createFactory()
      const accountData: AccountModel = {
        id: new ObjectId().toString(),
        accessToken: 'some_token',
        email: 'some_email',
        name: 'some_name',
        password: 'some_password',
        role: Role.User,
      }

      // Act
      const createdAccount = await sut.createAccount(accountData)

      // Assert
      const accountInDatabase = await accountCollection.findOne({
        _id: new ObjectId(accountData.id),
      })
      expect(createdAccount.id).toEqual(accountInDatabase?._id.toString())
    })
  })
})
