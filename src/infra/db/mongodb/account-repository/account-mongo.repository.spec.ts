import { Collection, ObjectId } from 'mongodb'
import { Role } from '@/auth'
import { AccountModel } from '@/data/use-cases/account/add-account/db-add-account.protocols'
import { AccountByTokenNotFoundError } from '@/data/use-cases/account/load-account-by-token/errors'
import { mongoHelper } from '../helpers/mongo-helper'
import { clearAccountsCollection } from '../helpers/test-teardown-helpers'
import { AccountMongoRepository } from './account-mongo.repository'
import { AccountNotFoundError } from './account-not-found.error'
import { getAccountsCollection } from '../helpers/collections'
import { MongoEntityFactory } from '../helpers/factories/mongo-entity.factory'
import { createAccountFactory } from '../helpers/factories/mongo-account.factory'

describe('AccountMongoRepository', () => {
  let mongoAccountFactory: MongoEntityFactory<AccountModel>
  let accountsCollection: Collection

  beforeAll(async () => {
    await mongoHelper.connect()
    mongoAccountFactory = await createAccountFactory()
    accountsCollection = await getAccountsCollection()
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
        password: 'valid_password',
      })

      expect(account).toEqual({
        id: expect.any(String),
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
      })
    })
  })

  describe('loadByEmail', () => {
    it('should return an account by email on success', async () => {
      // Arrange
      const sut = new AccountMongoRepository()
      const savedAccount = await mongoAccountFactory.create()

      // Act
      const loadedAccount = await sut.loadByEmail(savedAccount.email)

      // Assert
      expect(loadedAccount?.id).toEqual(savedAccount.id)
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

  describe('loadById', () => {
    it('should return an account by id on success', async () => {
      // Arrange
      const sut = new AccountMongoRepository()
      const savedAccount = await mongoAccountFactory.create()

      // Act
      const loadedAccount = await sut.loadById(savedAccount.id)

      // Assert
      expect(loadedAccount).toEqual(savedAccount)
    })
  })

  describe('updateAccessToken', () => {
    it('should update an account access token on success', async () => {
      // Arrange
      const sut = new AccountMongoRepository()
      const existingAccount = await mongoAccountFactory.create()

      // Act
      await sut.updateAccessToken(existingAccount.id, 'valid_token')

      // Assert
      const updatedAccount = await accountsCollection.findOne<AccountModel>({
        _id: new ObjectId(existingAccount.id),
      })
      expect(updatedAccount?.accessToken).toBe('valid_token')
    })

    it('should throw an AccountNotFoundError if the account does not exist', async () => {
      // Arrange
      const sut = new AccountMongoRepository()

      // Act
      const updateAccessTokenPromise = sut.updateAccessToken(
        new ObjectId().toString(),
        'valid_token'
      )

      // Assert
      await expect(updateAccessTokenPromise).rejects.toThrowError(
        AccountNotFoundError
      )
    })

    it('should throw an AccountNotFoundError if the given id is not an ObjectId', async () => {
      // Arrange
      const sut = new AccountMongoRepository()

      // Act
      const updateAccessTokenPromise = sut.updateAccessToken(
        'not_an_object_id',
        'valid_token'
      )

      // Assert
      await expect(updateAccessTokenPromise).rejects.toThrowError(
        AccountNotFoundError
      )
    })
  })

  describe('loadByToken()', () => {
    it('should throw an AccountByTokenNotFoundError when account does not exist', async () => {
      const sut = new AccountMongoRepository()

      await expect(sut.loadByToken('nonexistent')).rejects.toThrowError(
        AccountByTokenNotFoundError
      )
    })

    it('should throw an AccountByTokenNotFoundError when role does not match', async () => {
      const sut = new AccountMongoRepository()
      await mongoAccountFactory.create({
        role: Role.Admin,
        accessToken: 'existing_token',
      })

      await expect(
        sut.loadByToken('existing_token', Role.User)
      ).rejects.toThrowError(AccountByTokenNotFoundError)
    })

    it('should return an account when no role is provided and token matches', async () => {
      const sut = new AccountMongoRepository()
      const account = await mongoAccountFactory.create({
        accessToken: 'existing_token',
      })

      const accountByToken = await sut.loadByToken('existing_token')

      expect(accountByToken.id).toEqual(account.id)
    })

    it('should return an account when role and token match', async () => {
      const sut = new AccountMongoRepository()
      const account = await mongoAccountFactory.create({
        accessToken: 'existing_token',
        role: Role.Admin,
      })

      const accountByToken = await sut.loadByToken('existing_token', Role.Admin)

      expect(accountByToken.id).toEqual(account.id)
    })
  })
})
