import { MongoClient } from 'mongodb'

export class MongoHelper {
  private client: MongoClient | undefined

  async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
  }

  async disconnect (): Promise<void> {
    await this.client?.close()
  }
}

export const mongoHelper = new MongoHelper()
