import { Collection, ObjectId } from 'mongodb'
import { SurveyModel } from '../../../../data/use-cases/add-survey/db-add-survey.use-case.protocols'
import { ModelAttributes } from '../../../../domain/models'
import { getSurveysCollection } from '../helpers/collections'
import { MongoEntityFactory } from '../helpers/factories/mongo-entity.factory'
import { mongoHelper } from '../helpers/mongo-helper'
import { clearSurveysCollection } from '../helpers/test-teardown-helpers'
import { SurveyMongoRepository } from './survey-mongo.repository'
import { createSurveysFactory } from '../helpers/factories/mongo-surveys.factory'

let surveysCollection: Collection<ModelAttributes<SurveyModel>>
let mongoSurveyFactory: MongoEntityFactory<SurveyModel>

describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await mongoHelper.connect()
    surveysCollection = await getSurveysCollection()
    mongoSurveyFactory = await createSurveysFactory()
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
            answer: 'any_answer',
          },
        ],
      })

      // Assert
      expect(survey).toEqual({
        id: expect.any(String),
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer',
          },
        ],
        createdAt: expect.any(Date),
      })

      await expect(existsInDatabase(survey)).resolves.toBeTruthy()
    })
  })

  describe('list', () => {
    it('should return an empty array when there is no survey', async () => {
      // Arrange
      const sut = await createSut()

      // Act
      const surveysList = await sut.list()

      // Assert
      expect(surveysList).toEqual([])
    })

    it('should return an array of surveys on success', async () => {
      // Arrange
      const sut = await createSut()
      const surveysInDb = [
        await mongoSurveyFactory.create(),
        await mongoSurveyFactory.create(),
      ]

      // Act
      const surveysList = await sut.list()

      // Assert
      expect(surveysList).toEqual(surveysInDb)
    })
  })
})

const createSut = async (): Promise<SurveyMongoRepository> => {
  return new SurveyMongoRepository()
}

const existsInDatabase = async (survey: SurveyModel): Promise<boolean> => {
  const surveyInDatabase = await surveysCollection.findOne({
    _id: new ObjectId(survey.id),
  })
  return Boolean(surveyInDatabase)
}
