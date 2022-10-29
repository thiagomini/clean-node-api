import { Collection, ObjectId } from 'mongodb'
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
