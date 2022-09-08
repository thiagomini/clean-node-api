import { Collection } from 'mongodb'
import { AddSurveyRepository } from '../../../../data/protocols/db/survey-repository'
import { AddSurveyInput, SurveyModel } from '../../../../data/use-cases/add-survey/db-add-survey.use-case.protocols'
import { addIdToDocument } from '../helpers/mongo-document-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  constructor (private readonly surveysCollection: Collection) {}

  async add (addSurveyInput: AddSurveyInput): Promise<SurveyModel> {
    await this.surveysCollection.insertOne(addSurveyInput)

    return addIdToDocument(addSurveyInput) as SurveyModel
  }
}
