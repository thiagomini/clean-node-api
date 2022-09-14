import { Collection } from 'mongodb'
import { mongoHelper } from './mongo-helper'

export async function getSurveysCollection (): Promise<Collection> {
  return await mongoHelper.getCollection('surveys')
}
