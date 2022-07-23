import { MongoClient, Collection } from 'mongodb'
import { MongoConnectionError } from './errors'

class MongoHelper {
  private client: MongoClient | undefined

  async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
  }

  async disconnect (): Promise<void> {
    await this.client?.close()
  }

  getCollection (collectionName: string): Collection | never {
    if (!this.client) throw new MongoConnectionError(collectionName)

    return this.client?.db(collectionName).collection(collectionName)
  }
}

export const mongoHelper = new MongoHelper()
