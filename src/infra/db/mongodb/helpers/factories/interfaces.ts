import { Document } from 'mongodb'

export interface ModelWithOptionalId {
  id?: string
}

export interface ModelDefaultAttributesFactory<TSchema extends Document> {
  defaultAttributes(
    partialEntity?: Partial<TSchema>
  ): TSchema | Promise<TSchema>
}
