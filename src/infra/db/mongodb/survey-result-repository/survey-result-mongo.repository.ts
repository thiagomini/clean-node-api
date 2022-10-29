import { CreateOrUpdateSurveyResultRepository } from '@/data/protocols/db/survey-result-repository'
import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultInput } from '@/domain/use-cases/survey-result/save-survey-result'
import { Document, ObjectId } from 'mongodb'
import {
  getSurveyResultsCollection,
  SurveyResultCollection,
} from '../helpers/collections'
import { addIdToDocument } from '../helpers/mongo-document-helper'

export class SurveyResultMongoRepository
  implements CreateOrUpdateSurveyResultRepository
{
  async createOrUpdate(
    saveSurveyResultInput: SaveSurveyResultInput
  ): Promise<SurveyResultModel> {
    const surveyResultCollection = await this.getCollection()
    const findOrUpdateResult = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: new ObjectId(saveSurveyResultInput.surveyId),
        accountId: new ObjectId(saveSurveyResultInput.accountId),
      },
      {
        $set: {
          answer: saveSurveyResultInput.answer,
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    )

    const surveyResultModelToBeReturned: SurveyResultModel = {
      ...(addIdToDocument(
        findOrUpdateResult.value as Document
      ) as SurveyResultModel),
      accountId: findOrUpdateResult.value?.accountId.toString() as string,
      surveyId: findOrUpdateResult.value?.surveyId.toString() as string,
    }

    return surveyResultModelToBeReturned
  }

  private async getCollection(): Promise<SurveyResultCollection> {
    return await getSurveyResultsCollection()
  }
}
