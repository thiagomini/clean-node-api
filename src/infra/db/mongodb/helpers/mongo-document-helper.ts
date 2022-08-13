import { Document, ObjectId } from 'mongodb'
import { ModelAttributes } from '../../../../domain/models/model-attributes'
import { NullDocumentError } from './errors'

export type DocumentWithId<T> = Omit<T, '_id'> & { id: string | undefined }

export type DocumentWithMongoId<T> = ModelAttributes<T> & { _id: ObjectId }

export function addIdToDocument<T extends Document> (mongoDocument: T): DocumentWithId<T> {
  if (!mongoDocument) throw new NullDocumentError(mongoDocument)

  const { _id, ...otherProperties } = mongoDocument

  return {
    ...otherProperties,
    id: _id?.toString()
  }
}
