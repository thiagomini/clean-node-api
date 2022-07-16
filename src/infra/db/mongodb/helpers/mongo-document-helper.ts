import { Document } from 'mongodb'
import { NullDocumentError } from './errors/null-document.error'

type DocumentWithId = Document & {
  id: string
}

export function addIdToDocument<T extends Document> (mongoDocument: T): DocumentWithId {
  if (!mongoDocument) throw new NullDocumentError(mongoDocument)

  const { _id, otherProperties } = mongoDocument

  return {
    ...otherProperties,
    id: _id?.toString()
  }
}
