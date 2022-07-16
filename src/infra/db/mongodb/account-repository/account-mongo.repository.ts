import { AddAccountRepository } from '../../../../data/protocols/add-account.repository'
import { AccountModel } from '../../../../domain/models'
import { AddAccountInput } from '../../../../domain/use-cases/add-account'
import { addIdToDocument } from '../helpers/mongo-document-helper'
import { mongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (addAccountInput: AddAccountInput): Promise<AccountModel> {
    const accountCollection = mongoHelper.getCollection('accounts')

    await accountCollection.insertOne(addAccountInput)

    return addIdToDocument(addAccountInput) as AccountModel
  }
}
