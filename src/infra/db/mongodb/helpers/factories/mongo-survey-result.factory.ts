import { SurveyResultSchema } from '../../schemas'
import { getSurveyResultsCollection } from '../collections'
import { createAccountFactory } from './mongo-account.factory'
import { MongoEntityFactory } from './mongo-entity.factory'
import { MongoSurveyResultDefaultAttributesFactory } from './mongo-survey-result-default-attributes.factory'
import { createSurveysFactory } from './mongo-surveys.factory'

export type SurveyResultFactory = MongoEntityFactory<SurveyResultSchema>
export const createSurveyResultFactory =
  async (): Promise<SurveyResultFactory> => {
    const surveyResultCollection = await getSurveyResultsCollection()
    const accountFactory = await createAccountFactory()
    const surveyFactory = await createSurveysFactory()

    const defaultAttributesFactory =
      new MongoSurveyResultDefaultAttributesFactory(
        accountFactory,
        surveyFactory
      )
    return await MongoEntityFactory.createFactory(
      surveyResultCollection,
      defaultAttributesFactory
    )
  }
