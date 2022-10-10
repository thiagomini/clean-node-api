import { CreateOrUpdateSurveyResultRepository } from '@/data/protocols/db/survey-result-repository'
import { Collection, ObjectId, Document } from 'mongodb'
import { ModelAttributes, SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultInput } from '@/domain/use-cases/save-survey-result'
import {
  NonexistentAccountError,
  NonexistentSurveyError,
} from '@/domain/use-cases/save-survey-result/errors'
import {
  getAccountsCollection,
  getSurveyResultsCollection,
  getSurveysCollection,
} from '../helpers/collections'
import { addIdToDocument } from '../helpers/mongo-document-helper'

export class SurveyResultMongoRepository
  implements CreateOrUpdateSurveyResultRepository
{
  async createOrUpdate(
    saveSurveyResultInput: SaveSurveyResultInput
  ): Promise<SurveyResultModel> {
    const surveysCollection = await getSurveysCollection()
    const surveyInDatabase = await surveysCollection.findOne({
      _id: new ObjectId(saveSurveyResultInput.surveyId),
    })

    if (!surveyInDatabase) {
      throw new NonexistentSurveyError({
        surveyId: saveSurveyResultInput.surveyId,
      })
    }

    const accountsCollection = await getAccountsCollection()
    const accountInDatabase = await accountsCollection.findOne({
      _id: new ObjectId(saveSurveyResultInput.accountId),
    })

    if (!accountInDatabase) {
      throw new NonexistentAccountError({
        accountId: saveSurveyResultInput.accountId,
      })
    }

    const findOrUpdateResult = await (
      await this.getCollection()
    ).findOneAndUpdate(
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
