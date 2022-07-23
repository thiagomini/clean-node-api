import { mongoHelper } from './mongo-helper'

describe('MongoHelper', () => {
  describe('getCollection', () => {
    describe('when the client is connected', () => {
      beforeEach(async () => {
        await mongoHelper.connect()
      })

      afterEach(async () => {
        await mongoHelper.disconnect()
      })

      it('should return a collection', () => {
        expect(mongoHelper.getCollection('some-collection')).toBeDefined()
      })
    })
  })
})
