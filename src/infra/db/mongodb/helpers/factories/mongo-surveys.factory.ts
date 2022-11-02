import { SurveySchema } from '../../schemas'
import { getSurveysCollection } from '../collections'
import { MongoEntityFactory } from './mongo-entity.factory'
import { MongoSurveyDefaultAttributesFactory } from './mongo-surveys-default-attributes.factory'

export type SurveyFactory = MongoEntityFactory<SurveySchema>

export const createSurveysFactory = async (): Promise<SurveyFactory> => {
  const surveysCollection = await getSurveysCollection()
  return await MongoEntityFactory.createFactory(
    surveysCollection,
    new MongoSurveyDefaultAttributesFactory()
  )
}
