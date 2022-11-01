import { ModelAttributes, SurveyResultModel } from '@/domain/models'
import { ObjectId } from 'mongodb'
import {
  getSurveyResultsCollection,
  SurveyResultCollection,
} from '../collections'
import { addIdToDocument } from '../mongo-document-helper'
import { ModelDefaultAttributesFactory } from './interfaces'
import { createAccountFactory } from './mongo-account.factory'
import { MongoSurveyResultDefaultAttributesFactory } from './mongo-survey-result-default-attributes.factory'
import { createSurveysFactory } from './mongo-surveys.factory'

export const createSurveyResultFactory =
  async (): Promise<MongoSurveyResultFactory> => {
    const surveyResultCollection = await getSurveyResultsCollection()
    const accountFactory = await createAccountFactory()
    const surveyFactory = await createSurveysFactory()

    const defaultAttributesFactory =
      new MongoSurveyResultDefaultAttributesFactory(
        accountFactory,
        surveyFactory
      )
    return new MongoSurveyResultFactory(
      surveyResultCollection,
      defaultAttributesFactory
    )
  }

export class MongoSurveyResultFactory {
  constructor(
    private readonly collection: SurveyResultCollection,
    private readonly modelDefaultAttributesFactory: ModelDefaultAttributesFactory<SurveyResultModel>
  ) {}

  public async create(
    partialEntity: Partial<SurveyResultModel> = {}
  ): Promise<SurveyResultModel> {
    const finalInput = await this.mergeGivenAndDefaultAttributes(partialEntity)
    await this.collection.insertOne({
      accountId: new ObjectId(finalInput.accountId),
      surveyId: new ObjectId(finalInput.surveyId),
      answer: finalInput.answer,
      createdAt: finalInput.createdAt,
      _id: finalInput._id as ObjectId,
    })

    return addIdToDocument(finalInput) as SurveyResultModel
  }

  private async mergeGivenAndDefaultAttributes(
    partialEntity: Partial<SurveyResultModel> = {}
  ): Promise<ModelAttributes<SurveyResultModel> & { _id?: ObjectId }> {
    const { id, ...accountInputWithoutId } = partialEntity
    const passedMongoId = new ObjectId(id)

    const defaultAttributes =
      await this.modelDefaultAttributesFactory.defaultAttributes()

    return {
      ...defaultAttributes,
      ...accountInputWithoutId,
      _id: passedMongoId,
    }
  }
}
