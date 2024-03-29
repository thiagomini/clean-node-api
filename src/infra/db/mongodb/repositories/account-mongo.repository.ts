import { Filter, ObjectId } from 'mongodb'
import { Role } from '@/auth'
import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByIdRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from '@/data/protocols/db/account-repository'
import {
  AccountModel,
  AddAccountInput,
} from '@/data/use-cases/account/add-account/db-add-account.protocols'
import { AccountByTokenNotFoundError } from '@/data/use-cases/account/load-account-by-token/errors'
import { Optional } from '@/utils'
import { getAccountsCollection } from '../helpers/collections'
import { addIdToDocument } from '../helpers/mongo-document-helper'
import { AccountNotFoundError } from './account-not-found.error'
import { isInvalidIdError } from '../helpers/error-helper'
import { AccountSchema } from '../schemas'

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository,
    LoadAccountByIdRepository
{
  async add(addAccountInput: AddAccountInput): Promise<AccountModel> {
    const accountCollection = await getAccountsCollection()

    await accountCollection.insertOne(addAccountInput)

    return addIdToDocument(addAccountInput) as AccountModel
  }

  async loadByEmail(email: string): Promise<Optional<AccountModel>> {
    const accountCollection = await getAccountsCollection()

    const accountByEmail = await accountCollection.findOne({
      email,
    })

    if (accountByEmail) {
      return addIdToDocument(accountByEmail) as AccountModel
    }
  }

  async loadById(id: string): Promise<Optional<AccountModel>> {
    try {
      return await this.findAccountById(id)
    } catch (err) {
      if (isInvalidIdError(err as Error)) {
        return undefined
      }

      throw err
    }
  }

  private async findAccountById(id: string): Promise<Optional<AccountModel>> {
    const accountCollection = await getAccountsCollection()

    const accountById = await accountCollection.findOne({
      _id: new ObjectId(id),
    })

    if (accountById) {
      return addIdToDocument(accountById) as AccountModel
    }
  }

  async updateAccessToken(id: string, accessToken: string): Promise<void> {
    const accountCollection = await getAccountsCollection()
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
    const accountCollection = await getAccountsCollection()

    const accountByEmailFilter: Filter<AccountSchema> = {
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
}
