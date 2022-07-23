import { MongoClient, Collection } from 'mongodb'

class MongoHelper {
  private client?: MongoClient
  private url?: string

  async connect (url: string = process.env.MONGO_URL ?? ''): Promise<void> {
    this.url = url
    this.client = await MongoClient.connect(url)
  }

  async disconnect (): Promise<void> {
    await this.client?.close()
    this.client = undefined
  }

  async getCollection (collectionName: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.url)
    }

    return (this.client as MongoClient).db(collectionName).collection(collectionName)
  }
}

export const mongoHelper = new MongoHelper()
