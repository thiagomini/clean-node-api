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
})