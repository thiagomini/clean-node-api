import { AccountModel } from '../../../../../domain/models'
import { mongoHelper } from '../mongo-helper'
import { MongoAccountDefaultAttributesFactory } from './mongo-account-default-attributes.factory'
import { MongoEntityFactory } from './mongo-entity.factory'

export const createAccountFactory = async (): Promise<
  MongoEntityFactory<AccountModel>
> => {
  const accountCollection = await mongoHelper.getCollection<AccountModel>(
    'accounts'
  )
  return await MongoEntityFactory.createFactory(
    accountCollection,
    new MongoAccountDefaultAttributesFactory()
  )
}
