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
})
