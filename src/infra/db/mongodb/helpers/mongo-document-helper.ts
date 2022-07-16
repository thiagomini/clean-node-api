import { Document } from 'mongodb'
import { NullDocumentError } from './errors/null-document.error'

type DocumentWithId = Document & {
  id: string
}

export function setIdAttributeTo<T extends Document> (mongoDocument: T): DocumentWithId {
  if (!mongoDocument) throw new NullDocumentError()

  const { _id, otherProperties } = mongoDocument

  return {
    ...otherProperties,
    id: _id?.toString()
  }
}
