import { Collection } from 'mongodb'
import {
  ModelAttributes,
  SurveyModel,
  SurveyResultModel,
} from '@/domain/models'
import { mongoHelper } from './mongo-helper'

export async function getSurveysCollection(): Promise<
  Collection<ModelAttributes<SurveyModel>>
> {
  return await mongoHelper.getCollection('surveys')
}

export async function getSurveyResultsCollection(): Promise<
  Collection<ModelAttributes<SurveyResultModel>>
> {
  return await mongoHelper.getCollection('survey.results')
}

export async function getAccountsCollection(): Promise<Collection> {
  return await mongoHelper.getCollection('accounts')
}
