import { mongoHelper } from './mongo-helper'

export async function clearAccountsCollection (): Promise<void> {
  const accountsCollection = await mongoHelper.getCollection('accounts')
  await accountsCollection.deleteMany({})
}
