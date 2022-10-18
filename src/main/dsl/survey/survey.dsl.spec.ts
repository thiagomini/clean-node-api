import { ModelAttributes, SurveyModel } from '@/domain/models'
import { getSurveysCollection } from '@/infra/db/mongodb/helpers/collections'
import { mongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { clearSurveysCollection } from '@/infra/db/mongodb/helpers/test-teardown-helpers'
import { Collection, ObjectId } from 'mongodb'
import { AddSurveyInput } from '../../../domain/use-cases/survey/add-survey'
import { SurveyDSL } from './survey.dsl'

describe('SurveyDSL', () => {
  let surveysCollection: Collection<ModelAttributes<SurveyModel>>

  beforeAll(async () => {
    surveysCollection = await getSurveysCollection()
  })

  afterEach(async () => {
    await clearSurveysCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  describe('createSurvey', () => {
    it('should create a new survey with all parameters', async () => {
      const surveyDSL = await SurveyDSL.create()

      const surveyInput: AddSurveyInput = {
        question: 'test_question',
        answers: [
          {
            answer: 'any_answer',
            image: 'any_image',
          },
          {
            answer: 'any_answer_2',
            image: 'any_image_2',
          },
        ],
      }
      await surveyDSL.createSurvey(surveyInput)

      const surveyInDb = await surveysCollection.findOne({
        question: 'test_question',
      })

      expect(surveyInDb).toMatchObject(surveyInput)
    })

    it('should create a new survey with default parameters', async () => {
      const surveyDSL = await SurveyDSL.create()

      const surveyId = await surveyDSL.createSurvey()

      const surveyInDb = await surveysCollection.findOne({
        _id: new ObjectId(surveyId),
      })

      expect(surveyInDb).toBeDefined()
    })
  })
})
