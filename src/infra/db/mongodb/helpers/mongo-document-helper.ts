import { Document } from 'mongodb'
import { NullDocumentError } from './errors'

export type DocumentWithId<T> = Omit<T, '_id'> & { id: string | undefined }

export function addIdToDocument<T extends Document> (mongoDocument: T): DocumentWithId<T> {
  if (!mongoDocument) throw new NullDocumentError(mongoDocument)

  const { _id, ...otherProperties } = mongoDocument

  return {
    ...otherProperties,
    id: _id?.toString()
  }
}
