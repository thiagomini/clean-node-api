import { ContextError } from '../../../../../errors'

export class MongoConnectionError extends ContextError {
  constructor (collectionName: string) {
    super({
      message: `Cannot retrieve collection ${collectionName}: mongo client is not connected`,
      errorName: MongoConnectionError.name
    })
  }
}
