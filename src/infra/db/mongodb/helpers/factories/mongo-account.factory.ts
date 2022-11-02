import { AccountSchema } from '../../schemas'
import { getAccountsCollection } from '../collections'
import { MongoAccountDefaultAttributesFactory } from './mongo-account-default-attributes.factory'
import { MongoEntityFactory } from './mongo-entity.factory'

export type AccountFactory = MongoEntityFactory<AccountSchema>

export const createAccountFactory = async (): Promise<AccountFactory> => {
  const accountCollection = await getAccountsCollection()

  return await MongoEntityFactory.createFactory(
    accountCollection,
    new MongoAccountDefaultAttributesFactory()
  )
}
