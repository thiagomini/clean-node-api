import { Document } from 'mongodb'

type DocumentWithId = Document & {
  id: string
}

export function setIdAttributeTo<T extends Document> (mongoDocument: T): DocumentWithId {
  const { _id, otherProperties } = mongoDocument

  return {
    ...otherProperties,
    id: _id?.toString()
  }
}
