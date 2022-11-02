import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import { SurveyResultSchema } from '../../schemas'
import { SchemaDefaultAttributesFactory } from './interfaces'
import { AccountFactory } from './mongo-account.factory'
import { SurveyFactory } from './mongo-surveys.factory'

export class MongoSurveyResultDefaultAttributesFactory
  implements SchemaDefaultAttributesFactory<SurveyResultSchema>
{
  constructor(
    private readonly accountFactory: AccountFactory,
    private readonly surveyFactory: SurveyFactory
  ) {}

  async defaultAttributes(
    partialEntity?: Partial<SurveyResultSchema>
  ): Promise<SurveyResultSchema> {
    const accountId = await this.getAccountId(partialEntity)
    const surveyId = await this.getSurveyId(partialEntity)

    return {
      createdAt: new Date(),
      accountId,
      answer: faker.lorem.word(10),
      surveyId,
    }
  }

  private async getAccountId(
    partialEntity?: Partial<SurveyResultSchema>
  ): Promise<ObjectId> {
    if (partialEntity?.accountId) {
      return partialEntity.accountId
    }

    const defaultAccount = await this.accountFactory.create()
    return defaultAccount._id
  }

  private async getSurveyId(
    partialEntity?: Partial<SurveyResultSchema>
  ): Promise<ObjectId> {
    if (partialEntity?.surveyId) {
      return partialEntity.surveyId
    }

    const defaultSurvey = await this.surveyFactory.create()
    return defaultSurvey._id
  }
}
