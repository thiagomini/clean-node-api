import { SurveyResultModel } from '../../../../../domain/models'
import { mongoHelper } from '../mongo-helper'
import { createAccountFactory } from './mongo-account.factory'
import { MongoEntityFactory } from './mongo-entity.factory'
import { MongoSurveyResultDefaultAttributesFactory } from './mongo-survey-result-default-attributes.factory'
import { createSurveysFactory } from './mongo-surveys.factory'

export const createSurveyResultFactory = async (): Promise<
  MongoEntityFactory<SurveyResultModel>
> => {
  const surveyResultCollection =
    await mongoHelper.getCollection<SurveyResultModel>('surveyresults')

  const accountFactory = await createAccountFactory()
  const surveyFactory = await createSurveysFactory()

  return await MongoEntityFactory.createFactory(
    surveyResultCollection,
    new MongoSurveyResultDefaultAttributesFactory(accountFactory, surveyFactory)
  )
}
