import { Collection, ObjectId, OptionalId } from 'mongodb'
import { Role } from '../../../../../auth'
import { AccountModel } from '../../../../../domain/models'
import { ModelAttributes } from '../../../../../domain/models/model-attributes'
import { addIdToDocument } from '../mongo-document-helper'
import { mongoHelper } from '../mongo-helper'

export class MongoAccountFactory {
  constructor(
    private readonly accountCollection: Collection<
      ModelAttributes<AccountModel>
    >
  ) {}

  public async createAccount(
    accountInput: Partial<AccountModel> = {}
  ): Promise<AccountModel> {
    const finalInput = this.mergeGivenAndDefaultAttributes(accountInput)
    await this.accountCollection.insertOne(finalInput)
    return addIdToDocument(finalInput) as AccountModel
  }

  private mergeGivenAndDefaultAttributes(
    accountInput: Partial<AccountModel> = {}
  ): OptionalId<ModelAttributes<AccountModel>> {
    const mongoIdToBeInserted = new ObjectId(accountInput.id)
    const { id, ...accountInputWithoutId } = accountInput

    return Object.assign(
      {},
      {
        _id: mongoIdToBeInserted,
        ...this.getAccountDefaultAttributes(),
      },
      accountInputWithoutId
    )
  }

  private getAccountDefaultAttributes(): ModelAttributes<AccountModel> {
    return {
      name: 'valid_name',
      email: 'valid_email',
      accessToken: 'valid_access_token',
      password: 'hashed_password',
      role: Role.User,
    }
  }

  static async createFactory(): Promise<MongoAccountFactory> {
    const accountCollection = await mongoHelper.getCollection<
      ModelAttributes<AccountModel>
    >('accounts')
    return new MongoAccountFactory(accountCollection)
  }
}
