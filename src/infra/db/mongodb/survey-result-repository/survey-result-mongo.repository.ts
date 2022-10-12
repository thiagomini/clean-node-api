import { CreateOrUpdateSurveyResultRepository } from '@/data/protocols/db/survey-result-repository'
import { ModelAttributes, SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultInput } from '@/domain/use-cases/survey-result/save-survey-result'
import { Collection, Document } from 'mongodb'
import { getSurveyResultsCollection } from '../helpers/collections'
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
        surveyId: saveSurveyResultInput.surveyId,
        accountId: saveSurveyResultInput.accountId,
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

    return addIdToDocument(
      findOrUpdateResult.value as Document
    ) as SurveyResultModel
  }

  private async getCollection(): Promise<
    Collection<ModelAttributes<SurveyResultModel>>
  > {
    return await getSurveyResultsCollection()
  }
}
