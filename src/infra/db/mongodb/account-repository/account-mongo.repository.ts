import { Collection, Filter, ObjectId } from 'mongodb'
import { Role } from '../../../../auth'
import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from '../../../../data/protocols/db/account-repository'
import {
  AccountModel,
  AddAccountInput,
} from '../../../../data/use-cases/add-account/db-add-account.protocols'
import { AccountByTokenNotFoundError } from '../../../../data/use-cases/load-account-by-token/errors'
import { Optional } from '../../../../utils'
import { addIdToDocument } from '../helpers/mongo-document-helper'
import { mongoHelper } from '../helpers/mongo-helper'
import { AccountNotFoundError } from './account-not-found.error'

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository
{
  async add(addAccountInput: AddAccountInput): Promise<AccountModel> {
    const accountCollection = await this.getAccountsCollection()

    await accountCollection.insertOne(addAccountInput)

    return addIdToDocument(addAccountInput) as AccountModel
  }

  async loadByEmail(email: string): Promise<Optional<AccountModel>> {
    const accountCollection = await this.getAccountsCollection()

    const accountByEmail = await accountCollection.findOne({
      email,
    })

    if (accountByEmail) {
      return addIdToDocument(accountByEmail) as AccountModel
    }
  }

  async updateAccessToken(id: string, accessToken: string): Promise<void> {
    const accountCollection = await this.getAccountsCollection()
    const idAsMongoObjectId = this.transformToMongoObjectId(id)

    const updateResult = await accountCollection.updateOne(
      {
        _id: idAsMongoObjectId,
      },
      {
        $set: {
          accessToken,
        },
      }
    )

    if (updateResult.matchedCount === 0) {
      throw new AccountNotFoundError(id)
    }
  }

  private transformToMongoObjectId(id: string): ObjectId {
    try {
      return new ObjectId(id)
    } catch (err) {
      throw new AccountNotFoundError(id)
    }
  }

  public async loadByToken(token: string, role?: Role): Promise<AccountModel> {
    const accountCollection = await this.getAccountsCollection()

    const accountByEmailFilter: Filter<AccountModel> = {
      accessToken: token,
    }

    if (role) {
      accountByEmailFilter.role = role
    }

    const accountByEmail = await accountCollection.findOne(accountByEmailFilter)

    if (accountByEmail) {
      return addIdToDocument(accountByEmail) as AccountModel
    }
    throw new AccountByTokenNotFoundError(token)
  }

  private async getAccountsCollection(): Promise<Collection> {
    return await mongoHelper.getCollection('accounts')
  }
}
