import { mongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo.repository'
import { clearSurveysCollection } from '../helpers/test-teardown-helpers'
import { getSurveysCollection } from '../helpers/collections'
import { SurveyModel } from '../../../../data/use-cases/add-survey/db-add-survey.use-case.protocols'
import { Collection, ObjectId } from 'mongodb'

let surveysCollection: Collection

describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await mongoHelper.connect()
    surveysCollection = await getSurveysCollection()
  })

  beforeEach(async () => {
    await clearSurveysCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  describe('add', () => {
    it('should create a survey on success', async () => {
      // Arrange
      const sut = await createSut()

      // Act
      const survey = await sut.add({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          }
        ]
      })

      // Assert
      expect(survey).toEqual({
        id: expect.any(String),
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          }
        ]
      })

      await expect(existsInDatabase(survey)).resolves.toBeTruthy()
    })
  })
})

const createSut = async (): Promise<SurveyMongoRepository> => {
  return new SurveyMongoRepository(surveysCollection)
}

const existsInDatabase = async (survey: SurveyModel): Promise<boolean> => {
  const surveyInDatabase = await surveysCollection.findOne({ _id: new ObjectId(survey.id) })
  return Boolean(surveyInDatabase)
}
