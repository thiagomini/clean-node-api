import { Collection } from 'mongodb'
import { AccountModel } from '../../../../../domain/models'
import { mongoHelper } from '../mongo-helper'

export class MongoAccountFactory {
  constructor (private readonly accountCollection: Collection<AccountModel>) {}
  static async createFactory (): Promise<MongoAccountFactory> {
    const accountCollection = await mongoHelper.getCollection<AccountModel>('accounts')
    return new MongoAccountFactory(accountCollection)
  }
}
