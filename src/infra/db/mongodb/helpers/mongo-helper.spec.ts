import { MongoConnectionError } from './errors'
import { mongoHelper } from './mongo-helper'

describe('MongoHelper', () => {
  describe('getCollection', () => {
    it('should throw an error if mongoClient is not available', () => {
      expect(() => mongoHelper.getCollection('some-collection')).toThrowError(MongoConnectionError)
    })
  })
})
