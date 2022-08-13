import { Collection, ObjectId } from 'mongodb'
import { AccountModel } from '../../../../../domain/models'
import { ModelAttributes } from '../../../../../domain/models/model-attributes'
import { addIdToDocument } from '../mongo-document-helper'
import { mongoHelper } from '../mongo-helper'

export class MongoAccountFactory {
  constructor (private readonly accountCollection: Collection<ModelAttributes<AccountModel>>) {}

  public async createAccount (accountInput: Partial<AccountModel> = {}): Promise<AccountModel> {
    const idToBeInserted = new ObjectId(accountInput.id) ?? new ObjectId()
    const { id, ...dataWithoutId } = accountInput

    const finalInput = Object.assign({}, {
      _id: idToBeInserted,
      name: 'valid_name',
      email: 'valid_email',
      accessToken: 'valid_access_token',
      password: 'hashed_password'
    }, dataWithoutId)

    await this.accountCollection.insertOne(finalInput)
    return addIdToDocument(finalInput) as AccountModel
  }

  static async createFactory (): Promise<MongoAccountFactory> {
    const accountCollection = await mongoHelper.getCollection<ModelAttributes<AccountModel>>('accounts')
    return new MongoAccountFactory(accountCollection)
  }
}
