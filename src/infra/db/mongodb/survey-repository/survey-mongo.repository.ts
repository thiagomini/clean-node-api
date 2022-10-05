import { Collection, ObjectId } from 'mongodb'
import { AddSurveyRepository } from '@/data/protocols/db/survey-repository'
import {
  AddSurveyInput,
  SurveyModel,
} from '@/data/use-cases/add-survey/db-add-survey.use-case.protocols'
import { ModelAttributes } from '@/domain/models'
import { LoadSurveysUseCase } from '@/domain/use-cases/list-surveys'
import { getSurveysCollection } from '../helpers/collections'
import { addIdToDocument } from '../helpers/mongo-document-helper'
import {
  FindSurveyByIdRepository,
  Optional,
} from '../../../../data/use-cases/find-survey/find-survey-by-id.protocols'

export class SurveyMongoRepository
  implements AddSurveyRepository, LoadSurveysUseCase, FindSurveyByIdRepository
{
  async findById(id: string): Promise<Optional<SurveyModel>> {
    try {
      return await this.findSurveyById(id)
    } catch (err) {
      if (this.isInvalidIdError(err as Error)) {
        return undefined
      }

      throw err
    }
  }

  private async findSurveyById(id: string): Promise<Optional<SurveyModel>> {
    const surveysCollection = await this.getCollection()

    const surveyInDb = await surveysCollection.findOne({
      _id: new ObjectId(id),
    })

    if (surveyInDb) {
      return addIdToDocument(surveyInDb) as SurveyModel
    }
  }

  private isInvalidIdError(error: Error): boolean {
    return error.name === 'BSONTypeError'
  }

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
