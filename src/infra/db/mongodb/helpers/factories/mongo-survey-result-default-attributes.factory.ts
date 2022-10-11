import {
  AccountModel,
  ModelAttributes,
  SurveyModel,
  SurveyResultModel,
} from '@/domain/models'
import { faker } from '@faker-js/faker'
import {
  ModelDefaultAttributesFactory,
  MongoEntityFactory,
} from './mongo-entity.factory'

export class MongoSurveyResultDefaultAttributesFactory
  implements ModelDefaultAttributesFactory<SurveyResultModel>
{
  constructor(
    private readonly accountFactory: MongoEntityFactory<AccountModel>,
    private readonly surveyFactory: MongoEntityFactory<SurveyModel>
  ) {}

  async defaultAttributes(
    partialEntity?: Partial<SurveyResultModel>
  ): Promise<ModelAttributes<SurveyResultModel>> {
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
    partialEntity?: Partial<SurveyResultModel>
  ): Promise<string> {
    if (partialEntity?.accountId) {
      return partialEntity.accountId
    }

    const defaultAccount = await this.accountFactory.create()
    return defaultAccount.id
  }

  private async getSurveyId(
    partialEntity?: Partial<SurveyResultModel>
  ): Promise<string> {
    if (partialEntity?.surveyId) {
      return partialEntity.surveyId
    }

    const defaultSurvey = await this.surveyFactory.create()
    return defaultSurvey.id
  }
}
