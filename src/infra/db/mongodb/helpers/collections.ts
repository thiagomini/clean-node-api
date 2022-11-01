import { SurveyResultModel } from '@/domain/models'
import { Collection, ObjectId } from 'mongodb'
import { SurveySchema } from '../schemas'
import { mongoHelper } from './mongo-helper'

export type SurveysCollection = Collection<SurveySchema>
export async function getSurveysCollection(): Promise<SurveysCollection> {
  return await mongoHelper.getCollection('surveys')
}

export type SurveyResultCollection = Collection<
  Pick<SurveyResultModel, 'answer' | 'createdAt'> & {
    surveyId: ObjectId
    accountId: ObjectId
  }
>
export async function getSurveyResultsCollection(): Promise<SurveyResultCollection> {
  return await mongoHelper.getCollection('surveyresults')
}

export async function getAccountsCollection(): Promise<Collection> {
  return await mongoHelper.getCollection('accounts')
}
