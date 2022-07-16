import { Document } from 'mongodb'
import { NullDocumentError } from './errors/null-document.error'

export function addIdToDocument<T extends Document> (mongoDocument: T): T & { id: string } {
  if (!mongoDocument) throw new NullDocumentError(mongoDocument)

  const { _id, otherProperties } = mongoDocument

  return {
    ...otherProperties,
    id: _id?.toString()
  }
}
