import { Collection, ObjectId } from 'mongodb'
import { Role } from '@/auth'
import { AccountModel } from '@/domain/models'
import { DocumentWithMongoId } from '../mongo-document-helper'
import { mongoHelper } from '../mongo-helper'
import { clearAccountsCollection } from '../test-teardown-helpers'
import { MongoEntityFactory } from './mongo-entity.factory'
import { createAccountFactory } from './mongo-account.factory'

describe('MongoAccountFactory', () => {
  let accountCollection: Collection<DocumentWithMongoId<AccountModel>>

  beforeAll(async () => {
    await mongoHelper.connect()
    accountCollection = await mongoHelper.getCollection('accounts')
  })

  afterEach(async () => {
    await clearAccountsCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  describe('createAccountFactory', () => {
    it('should return a new MongoEntityFactory', async () => {
      const factory = await createAccountFactory()

      expect(factory).toBeInstanceOf(MongoEntityFactory)
    })
  })

  describe('createAccount', () => {
    it('should return an account with all given properties', async () => {
      // Arrange
      const sut = await createAccountFactory()
      const accountData: AccountModel = {
        id: new ObjectId().toString(),
        accessToken: 'some_token',
        email: 'some_email',
        name: 'some_name',
        password: 'some_password',
        role: Role.User,
      }

      // Act
      const createdAccount = await sut.create(accountData)

      // Assert
      expect(createdAccount).toEqual(accountData)
    })

    it('should return an account with all default properties', async () => {
      // Arrange
      const sut = await createAccountFactory()

      // Act
      const createdAccount = await sut.create()

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
      const sut = await createAccountFactory()
      const accountData: Partial<AccountModel> = {
        accessToken: 'some_token',
        email: 'some_email',
        name: 'some_name',
        password: 'some_password',
        role: Role.User,
      }

      // Act
      const createdAccount = await sut.create(accountData)

      // Assert
      expect(createdAccount).toEqual({
        ...accountData,
        id: expect.any(String),
      })
    })

    it('should be able to create the account in the database', async () => {
      // Arrange
      const sut = await createAccountFactory()
      const accountData: AccountModel = {
        id: new ObjectId().toString(),
        accessToken: 'some_token',
        email: 'some_email',
        name: 'some_name',
        password: 'some_password',
        role: Role.User,
      }

      // Act
      const createdAccount = await sut.create(accountData)

      // Assert
      const accountInDatabase = await accountCollection.findOne({
        _id: new ObjectId(accountData.id),
      })
      expect(createdAccount.id).toEqual(accountInDatabase?._id.toString())
    })
  })
})
