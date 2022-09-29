import { Collection } from 'mongodb'
import { AddSurveyRepository } from '@/data/protocols/db/survey-repository'
import {
  AddSurveyInput,
  SurveyModel,
} from '@/data/use-cases/add-survey/db-add-survey.use-case.protocols'
import { ModelAttributes } from '@/domain/models'
import { LoadSurveysUseCase } from '@/domain/use-cases/list-surveys'
import { getSurveysCollection } from '../helpers/collections'
import { addIdToDocument } from '../helpers/mongo-document-helper'

export class SurveyMongoRepository
  implements AddSurveyRepository, LoadSurveysUseCase
{
  async list(): Promise<SurveyModel[]> {
    const surveysCollection = await this.getCollection()
    const surveysInDb = await surveysCollection.find().toArray()
    return surveysInDb.map(addIdToDocument) as SurveyModel[]
  }

  async add(addSurveyInput: AddSurveyInput): Promise<SurveyModel> {
    const surveysCollection = await this.getCollection()
    const surveyInputWithDate = {
      ...addSurveyInput,
      createdAt: new Date(),
    }
    await surveysCollection.insertOne(surveyInputWithDate)

    return addIdToDocument(surveyInputWithDate) as SurveyModel
  }

  private async getCollection(): Promise<
    Collection<ModelAttributes<SurveyModel>>
  > {
    return await getSurveysCollection()
  }
}
