import { Collection, ObjectId } from 'mongodb'
import { AccountModel } from '../../../../data/use-cases/add-account/db-add-account.protocols'
import { MongoAccountFactory } from '../helpers/factories/mongo-account.factory'
import { mongoHelper } from '../helpers/mongo-helper'
import { clearAccountsCollection } from '../helpers/test-teardown-helpers'
import { AccountMongoRepository } from './account-mongo.repository'
import { AccountNotFoundError } from './account-not-found.error'

describe('AccountMongoRepository', () => {
  let mongoAccountFactory: MongoAccountFactory
  let accountsCollection: Collection

  beforeAll(async () => {
    await mongoHelper.connect()
    mongoAccountFactory = await MongoAccountFactory.createFactory()
    accountsCollection = await mongoHelper.getCollection('accounts')
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

    it('should return an undefined if account does not exist', async () => {
      // Arrange
      const sut = new AccountMongoRepository()

      // Act
      const account = await sut.loadByEmail('nonexistent@mail.com')

      // Assert
      expect(account).toBeUndefined()
    })
  })

  describe('updateAccessToken', () => {
    it('should update an account access token on success', async () => {
      // Arrange
      const sut = new AccountMongoRepository()
      const existingAccount = await mongoAccountFactory.createAccount()

      // Act
      await sut.updateAccessToken(existingAccount.id, 'valid_token')

      // Assert
      const updatedAccount = await accountsCollection.findOne<AccountModel>({ _id: new ObjectId(existingAccount.id) })
      expect(updatedAccount?.accessToken).toBe('valid_token')
    })

    it('should throw an AccountNotFoundError if the account does not exist', async () => {
      // Arrange
      const sut = new AccountMongoRepository()

      // Act
      const updateAccessTokenPromise = sut.updateAccessToken(new ObjectId().toString(), 'valid_token')

      // Assert
      await expect(updateAccessTokenPromise).rejects.toThrowError(AccountNotFoundError)
    })

    it('should throw an AccountNotFoundError if the given id is not an ObjectId', async () => {
      // Arrange
      const sut = new AccountMongoRepository()

      // Act
      const updateAccessTokenPromise = sut.updateAccessToken('not_an_object_id', 'valid_token')

      // Assert
      await expect(updateAccessTokenPromise).rejects.toThrowError(AccountNotFoundError)
    })
  })
})
