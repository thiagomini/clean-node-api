import { Document } from 'mongodb'
import { NullDocumentError } from './errors/null-document.error'
import { setIdAttributeTo } from './mongo-document-helper'

describe('setIdAttributeTo', () => {
  it('should add the id attribute from the _id', () => {
    const objectFromMongo = {
      _id: 'valid_id'
    }

    expect(setIdAttributeTo(objectFromMongo)).toEqual({
      id: 'valid_id'
    })
  })

  it('should return undefined id if the object does not have _id', () => {
    const objectFromMongo = {}

    expect(setIdAttributeTo(objectFromMongo)).toEqual({
      id: undefined
    })
  })

  it('should return throw an error if the object is undefined', () => {
    const objectFromMongo = undefined

    expect(() => setIdAttributeTo(objectFromMongo as unknown as Document)).toThrowError(NullDocumentError)
  })
})
