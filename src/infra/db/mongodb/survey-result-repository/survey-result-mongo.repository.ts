import { CreateOrUpdateSurveyResultRepository } from '@/data/protocols/db/survey-result-repository'
import { Collection, ObjectId } from 'mongodb'
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

export class SurveyResultMongoRepository
  implements CreateOrUpdateSurveyResultRepository
{
  async createOrUpdate(
    saveSurveyResultInput: SaveSurveyResultInput
  ): Promise<void> {
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

    await (
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
      }
    )
  }

  private async getCollection(): Promise<
    Collection<ModelAttributes<SurveyResultModel>>
  > {
    return await getSurveyResultsCollection()
  }
}
