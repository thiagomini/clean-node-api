import { SurveyModel } from '@/data/use-cases/survey/add-survey/db-add-survey.use-case.protocols'
import { SurveySummaryModel } from '@/domain/models'
import { createMock } from '@golevelup/ts-jest'
import { omit } from 'lodash'
import { Collection, ObjectId } from 'mongodb'
import { getSurveysCollection, SurveysCollection } from '../helpers/collections'
import {
  createSurveyResultFactory,
  SurveyResultFactory,
} from '../helpers/factories/mongo-survey-result.factory'
import {
  createSurveysFactory,
  SurveyFactory,
} from '../helpers/factories/mongo-surveys.factory'
import { addIdToDocument } from '../helpers/mongo-document-helper'
import { mongoHelper } from '../helpers/mongo-helper'
import {
  clearAccountsCollection,
  clearSurveyResultCollection,
  clearSurveysCollection,
} from '../helpers/test-teardown-helpers'
import { SurveyMongoRepository } from './survey-mongo.repository'

let surveysCollection: SurveysCollection
let mongoSurveyFactory: SurveyFactory
let surveyResultFactory: SurveyResultFactory

describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await mongoHelper.connect()
    surveysCollection = await getSurveysCollection()
    mongoSurveyFactory = await createSurveysFactory()
    surveyResultFactory = await createSurveyResultFactory()
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
      expect(surveysList).toEqual(
        expect.arrayContaining(
          surveysInDb.map((survey) => addIdToDocument(survey))
        )
      )
      expect(surveysList).toHaveLength(surveysInDb.length)
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
      const foundSurvey = await sut.findById(existingSurvey._id.toString())

      // Assert
      expect(foundSurvey).toMatchObject(omit(existingSurvey, '_id'))
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
    describe('when there is no answer', () => {
      it('should return a summary with zero answers', async () => {
        // Arrange
        const sut = await createSut()
        const existingSurvey = await mongoSurveyFactory.create()

        // Act
        const surveySummary = await sut.loadSummaryById(
          existingSurvey._id.toString()
        )

        // Assert
        expect(surveySummary).toEqual<SurveySummaryModel>({
          surveyId: existingSurvey._id.toString(),
          question: existingSurvey.question,
          createdAt: existingSurvey.createdAt,
          answers: [],
        })
      })
    })

    describe('when there is a single answer', () => {
      it('should return a summary with one answer, count 1 and percent as 100', async () => {
        // Arrange
        const sut = await createSut()
        const existingSurvey = await mongoSurveyFactory.create()
        const firstAnswer = existingSurvey.answers[0]

        const singleAnswer = await surveyResultFactory.create({
          surveyId: existingSurvey._id,
          answer: firstAnswer.answer,
        })

        // Act
        const surveySummary = await sut.loadSummaryById(
          singleAnswer.surveyId.toString()
        )

        // Assert
        expect(surveySummary).toEqual<SurveySummaryModel>({
          surveyId: singleAnswer.surveyId.toString(),
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
              surveyId: aSurvey._id,
              answer: firstAnswer.answer,
            }),
            surveyResultFactory.create({
              surveyId: aSurvey._id,
              answer: firstAnswer.answer,
            }),
          ])

          // Act
          const surveySummary = await sut.loadSummaryById(
            aSurvey._id.toString()
          )

          // Assert
          expect(surveySummary).toEqual<SurveySummaryModel>({
            surveyId: aSurvey._id.toString(),
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

      describe('and they have different answers', () => {
        it('should return a summary with two answers, count 1 and percent 50 for each', async () => {
          // Arrange
          const sut = await createSut()
          const aSurvey = await mongoSurveyFactory.create()
          const [firstAnswer, secondAnswer] = aSurvey.answers

          await Promise.all([
            surveyResultFactory.create({
              surveyId: aSurvey._id,
              answer: firstAnswer.answer,
            }),
            surveyResultFactory.create({
              surveyId: aSurvey._id,
              answer: secondAnswer.answer,
            }),
          ])

          // Act
          const surveySummary = await sut.loadSummaryById(
            aSurvey._id.toString()
          )

          // Assert
          expect(surveySummary).toEqual<SurveySummaryModel>({
            surveyId: aSurvey._id.toString(),
            question: aSurvey.question,
            createdAt: aSurvey.createdAt,
            answers: expect.arrayContaining([
              {
                answer: firstAnswer.answer,
                image: firstAnswer.image,
                count: 1,
                percent: 50,
              },
              {
                answer: secondAnswer.answer,
                image: secondAnswer.image,
                count: 1,
                percent: 50,
              },
            ]),
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
