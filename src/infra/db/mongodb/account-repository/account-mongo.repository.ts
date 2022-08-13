import { ObjectId } from 'mongodb'
import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '../../../../data/protocols/db/log-repository'
import { AddAccountRepository } from '../../../../data/protocols/db/account-repository'
import { AccountModel } from '../../../../domain/models'
import { AddAccountInput } from '../../../../domain/use-cases/add-account'
import { Optional } from '../../../../utils'
import { addIdToDocument } from '../helpers/mongo-document-helper'
import { mongoHelper } from '../helpers/mongo-helper'
import { AccountNotFoundError } from './account-not-found.error'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async add (addAccountInput: AddAccountInput): Promise<AccountModel> {
    const accountCollection = await mongoHelper.getCollection('accounts')

    await accountCollection.insertOne(addAccountInput)

    return addIdToDocument(addAccountInput) as AccountModel
  }

  async loadByEmail (email: string): Promise<Optional<AccountModel>> {
    const accountCollection = await mongoHelper.getCollection('accounts')

    const accountByEmail = await accountCollection.findOne({
      email
    })

    if (accountByEmail) {
      return addIdToDocument(accountByEmail) as AccountModel
    }
  }

  async updateAccessToken (id: string, accessToken: string): Promise<void> {
    const accountCollection = await mongoHelper.getCollection('accounts')
    const idAsMongoObjectId = this.transformToMongoObjectId(id)

    const updateResult = await accountCollection.updateOne({
      _id: idAsMongoObjectId
    }, {
      $set: {
        accessToken
      }
    })

    if (updateResult.matchedCount === 0) {
      throw new AccountNotFoundError(id)
    }
  }

  private transformToMongoObjectId (id: string): ObjectId {
    try {
      return new ObjectId(id)
    } catch (err) {
      throw new AccountNotFoundError(id)
    }
  }
}
