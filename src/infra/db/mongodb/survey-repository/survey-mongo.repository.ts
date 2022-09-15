import { Collection } from 'mongodb'
import { AddSurveyRepository } from '../../../../data/protocols/db/survey-repository'
import { AddSurveyInput, SurveyModel } from '../../../../data/use-cases/add-survey/db-add-survey.use-case.protocols'
import { getSurveysCollection } from '../helpers/collections'
import { addIdToDocument } from '../helpers/mongo-document-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (addSurveyInput: AddSurveyInput): Promise<SurveyModel> {
    const surveysCollection = await this.getCollection()
    const surveyInputWithDate = {
      ...addSurveyInput,
      createdAt: new Date()
    }
    await surveysCollection.insertOne(surveyInputWithDate)

    return addIdToDocument(surveyInputWithDate) as SurveyModel
  }

  private async getCollection (): Promise<Collection> {
    return await getSurveysCollection()
  }
}
