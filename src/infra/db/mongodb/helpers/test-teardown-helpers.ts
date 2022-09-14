import { mongoHelper } from './mongo-helper'

export async function clearAccountsCollection (): Promise<void> {
  const accountsCollection = await mongoHelper.getCollection('accounts')
  await accountsCollection.deleteMany({})
}

export async function clearErrorLogsCollection (): Promise<void> {
  const logsCollection = await mongoHelper.getCollection('errors')
  await logsCollection.deleteMany({})
}

export async function clearSurveysCollection (): Promise<void> {
  const accountsCollection = await mongoHelper.getCollection('surveys')
  await accountsCollection.deleteMany({})
}
