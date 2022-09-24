import { SurveyModel } from '../../../../../domain/models'
import { mongoHelper } from '../mongo-helper'
import { MongoEntityFactory } from './mongo-entity.factory'
import { MongoSurveyDefaultAttributesFactory } from './mongo-surveys-default-attributes.factory'

export const createSurveysFactory = async (): Promise<
  MongoEntityFactory<SurveyModel>
> => {
  const accountCollection = await mongoHelper.getCollection<SurveyModel>(
    'surveys'
  )
  return await MongoEntityFactory.createFactory(
    accountCollection,
    new MongoSurveyDefaultAttributesFactory()
  )
}
