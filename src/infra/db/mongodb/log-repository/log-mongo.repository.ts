import { LogErrorRepository } from '../../../../data/protocols'
import { ContextError } from '../../../../errors'
import { mongoHelper } from '../helpers/mongo-helper'

export class LogMongoRepository implements LogErrorRepository {
  async error (error: ContextError | Error): Promise<void> {
    const errorLogCollection = await mongoHelper.getCollection('errors')

    let context: unknown = {}
    let cause: ContextError | Error | undefined

    if (error instanceof ContextError) {
      context = error.context
      cause = error.cause
    }

    await errorLogCollection.insertOne({
      name: error.name,
      stack: error.stack,
      context,
      cause,
      createdAt: new Date()
    })
  }
}
