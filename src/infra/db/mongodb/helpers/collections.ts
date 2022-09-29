import { Collection } from 'mongodb'
import { ModelAttributes, SurveyModel } from '@/domain/models'
import { mongoHelper } from './mongo-helper'

export async function getSurveysCollection(): Promise<
  Collection<ModelAttributes<SurveyModel>>
> {
  return await mongoHelper.getCollection('surveys')
}

export async function getAccountsCollection(): Promise<Collection> {
  return await mongoHelper.getCollection('accounts')
}
