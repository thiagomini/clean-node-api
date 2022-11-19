import { mongoHelper } from '@/infra/db/mongodb/helpers'

describe('MongoHelper', () => {
  describe('getCollection', () => {
    describe('when the client is connected', () => {
      beforeEach(async () => {
        await mongoHelper.connect()
      })

      afterEach(async () => {
        await mongoHelper.disconnect()
      })

      it('should return a collection', async () => {
        expect(await mongoHelper.getCollection('some-collection')).toBeDefined()
      })

      describe('when the client is disconnected', () => {
        beforeEach(async () => {
          await mongoHelper.disconnect()
        })

        afterEach(async () => {
          await mongoHelper.disconnect()
        })

        it('should return a collection', async () => {
          expect(
            await mongoHelper.getCollection('some-collection')
          ).toBeDefined()
        })
      })
    })
  })
})
