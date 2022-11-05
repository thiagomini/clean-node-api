import { MongoClient, Collection, Document } from 'mongodb'

class MongoHelper {
  private client?: MongoClient
  private url?: string

  async connect(url: string = process.env.MONGO_URL ?? ''): Promise<void> {
    this.url = url
    this.client = await MongoClient.connect(url)
  }

  async disconnect(): Promise<void> {
    await this.client?.close()
    this.client = undefined
  }

  async getCollection<TModel extends Document = Document>(
    collectionName: string
  ): Promise<Collection<TModel>> {
    if (!this.client) {
      await this.connect(this.url)
    }

    return (this.client as MongoClient).db().collection<TModel>(collectionName)
  }
}

export const mongoHelper = new MongoHelper()
