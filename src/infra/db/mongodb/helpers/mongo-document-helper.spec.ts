import { Document } from 'mongodb'
import { NullDocumentError } from './errors'
import { addIdToDocument } from './mongo-document-helper'

describe('addIdToDocument', () => {
  it('should add the id attribute from the _id', () => {
    const objectFromMongo = {
      _id: 'valid_id',
      otherProp: 'any_value',
    }

    expect(addIdToDocument(objectFromMongo)).toEqual({
      id: 'valid_id',
      otherProp: 'any_value',
    })
  })

  it('should return undefined id if the object does not have _id', () => {
    const objectFromMongo = {}

    expect(addIdToDocument(objectFromMongo)).toEqual({
      id: undefined,
    })
  })

  it('should return throw an error if the object is undefined', () => {
    const objectFromMongo = undefined

    expect(() =>
      addIdToDocument(objectFromMongo as unknown as Document)
    ).toThrowError(NullDocumentError)
  })
})
