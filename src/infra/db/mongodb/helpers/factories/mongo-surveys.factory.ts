import { SurveyModel } from '../../../../../domain/models'
import { getSurveysCollection } from '../collections'
import { MongoEntityFactory } from './mongo-entity.factory'
import { MongoSurveyDefaultAttributesFactory } from './mongo-surveys-default-attributes.factory'

export const createSurveysFactory = async (): Promise<
  MongoEntityFactory<SurveyModel>
> => {
  const accountCollection = await getSurveysCollection()
  return await MongoEntityFactory.createFactory(
    accountCollection,
    new MongoSurveyDefaultAttributesFactory()
  )
}
