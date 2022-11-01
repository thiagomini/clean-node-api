import { Collection } from 'mongodb'
import { AccountSchema, SurveyResultSchema, SurveySchema } from '../schemas'
import { mongoHelper } from './mongo-helper'

export type SurveysCollection = Collection<SurveySchema>
export async function getSurveysCollection(): Promise<SurveysCollection> {
  return await mongoHelper.getCollection('surveys')
}

export type SurveyResultCollection = Collection<SurveyResultSchema>
export async function getSurveyResultsCollection(): Promise<SurveyResultCollection> {
  return await mongoHelper.getCollection('surveyresults')
}

export type AccountsCollection = Collection<AccountSchema>
export async function getAccountsCollection(): Promise<AccountsCollection> {
  return await mongoHelper.getCollection('accounts')
}
