import { SurveyModel } from '@/data/use-cases/survey/add-survey/db-add-survey.use-case.protocols'
import { ModelAttributes, SurveySummaryModel } from '@/domain/models'
import { createMock } from '@golevelup/ts-jest'
import { Collection, ObjectId } from 'mongodb'
import { getSurveysCollection } from '../helpers/collections'
import { MongoEntityFactory } from '../helpers/factories/mongo-entity.factory'
import {
  createSurveyResultFactory,
  MongoSurveyResultFactory,
} from '../helpers/factories/mongo-survey-result.factory'
import { createSurveysFactory } from '../helpers/factories/mongo-surveys.factory'
import { mongoHelper } from '../helpers/mongo-helper'
import {
  clearAccountsCollection,
  clearSurveyResultCollection,
  clearSurveysCollection,
} from '../helpers/test-teardown-helpers'
import { SurveyMongoRepository } from './survey-mongo.repository'

let surveysCollection: Collection<ModelAttributes<SurveyModel>>
let mongoSurveyFactory: MongoEntityFactory<SurveyModel>
let surveyResultFactory: MongoSurveyResultFactory

describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await mongoHelper.connect()
    surveysCollection = await getSurveysCollection()
    mongoSurveyFactory = await createSurveysFactory()
    surveyResultFactory = await createSurveyResultFactory()
  })

  beforeEach(async () => {
    await clearSurveysCollection()
  })

  afterEach(async () => {
    await clearSurveysCollection()
    await clearAccountsCollection()
    await clearSurveyResultCollection()
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

  describe('findById', () => {
    it('should return undefined when there is no survey with given id', async () => {
      // Arrange
      const sut = await createSut()
      const nonexistentId = new ObjectId()

      // Act
      const surveysList = await sut.findById(nonexistentId.toString())

      // Assert
      expect(surveysList).toBeUndefined()
    })

    it('should return undefined when given id is an invalid ObjectId', async () => {
      // Arrange
      const sut = await createSut()
      const invalidId = 'not_an_object_id'

      // Act
      const surveysList = await sut.findById(invalidId)

      // Assert
      expect(surveysList).toBeUndefined()
    })

    it('should return an existing survey by id on success', async () => {
      // Arrange
      const sut = await createSut()
      const existingSurvey = await mongoSurveyFactory.create()

      // Act
      const foundSurvey = await sut.findById(existingSurvey.id)

      // Assert
      expect(foundSurvey).toEqual(existingSurvey)
    })

    it('should throw an error if surveysCollection throws an unexpected error', async () => {
      // Arrange
      const stubCollection = createMock<Collection>({
        findOne() {
          throw new Error('Unexpected error')
        },
      })
      jest
        .spyOn(mongoHelper, 'getCollection')
        .mockResolvedValueOnce(stubCollection)
      const sut = await createSut()

      // Act
      const findByIdPromise = sut.findById(new ObjectId().toString())

      // Assert
      await expect(findByIdPromise).rejects.toThrowError(Error)
    })
  })

  describe('loadSummaryById', () => {
    describe('when there is a single answer', () => {
      it('should return a summary with one answer, count 1 and percent as 100', async () => {
        // Arrange
        const sut = await createSut()
        const existingSurvey = await mongoSurveyFactory.create()
        const firstAnswer = existingSurvey.answers[0]

        const singleAnswer = await surveyResultFactory.create({
          surveyId: existingSurvey.id,
          answer: firstAnswer.answer,
        })

        // Act
        const surveySummary = await sut.loadSummaryById(singleAnswer.surveyId)

        // Assert
        expect(surveySummary).toEqual<SurveySummaryModel>({
          surveyId: singleAnswer.surveyId,
          question: existingSurvey.question,
          createdAt: existingSurvey.createdAt,
          answers: [
            {
              answer: singleAnswer.answer,
              image: firstAnswer.image,
              count: 1,
              percent: 100,
            },
          ],
        })
      })
    })

    describe('when there are two survey results', () => {
      describe('and they have the same answer', () => {
        it('should return a summary with one answer, count 2 and percent 100', async () => {
          // Arrange
          const sut = await createSut()
          const aSurvey = await mongoSurveyFactory.create()
          const firstAnswer = aSurvey.answers[0]

          await Promise.all([
            surveyResultFactory.create({
              surveyId: aSurvey.id,
              answer: firstAnswer.answer,
            }),
            surveyResultFactory.create({
              surveyId: aSurvey.id,
              answer: firstAnswer.answer,
            }),
          ])

          // Act
          const surveySummary = await sut.loadSummaryById(aSurvey.id)

          // Assert
          expect(surveySummary).toEqual<SurveySummaryModel>({
            surveyId: aSurvey.id,
            question: aSurvey.question,
            createdAt: aSurvey.createdAt,
            answers: [
              {
                answer: firstAnswer.answer,
                image: firstAnswer.image,
                count: 2,
                percent: 100,
              },
            ],
          })
        })
      })
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
