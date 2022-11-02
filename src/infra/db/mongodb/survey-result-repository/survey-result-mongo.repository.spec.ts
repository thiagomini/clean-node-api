import { SaveSurveyResultInput } from '@/domain/use-cases/survey-result/save-survey-result'
import {
  AccountFactory,
  createAccountFactory,
} from '../helpers/factories/mongo-account.factory'
import {
  createSurveyResultFactory,
  SurveyResultFactory,
} from '../helpers/factories/mongo-survey-result.factory'
import {
  createSurveysFactory,
  SurveyFactory,
} from '../helpers/factories/mongo-surveys.factory'
import { mongoHelper } from '../helpers/mongo-helper'
import {
  clearSurveyResultCollection,
  clearSurveysCollection,
} from '../helpers/test-teardown-helpers'
import { SurveyResultMongoRepository } from './survey-result-mongo.repository'

describe('SurveyResultMongoRepository', () => {
  let surveyFactory: SurveyFactory
  let accountFactory: AccountFactory
  let surveyResultFactory: SurveyResultFactory

  beforeAll(async () => {
    surveyFactory = await createSurveysFactory()
    accountFactory = await createAccountFactory()
    surveyResultFactory = await createSurveyResultFactory()
  })

  afterEach(async () => {
    await clearSurveysCollection()
    await clearSurveyResultCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  describe('createOrUpdate', () => {
    it('should create a new SurveyResult entry if there was no SurveyResult before', async () => {
      // Arrange
      const sut = new SurveyResultMongoRepository()
      const existingSurvey = await surveyFactory.create()
      const existingAccount = await accountFactory.create()

      const saveSurveyResultInput: SaveSurveyResultInput = {
        accountId: existingAccount._id.toString(),
        answer: 'valid_answer',
        surveyId: existingSurvey._id.toString(),
      }

      // Act
      const surveyResult = await sut.createOrUpdate(saveSurveyResultInput)

      // Assert
      expect(surveyResult).toEqual({
        id: expect.any(String),
        ...saveSurveyResultInput,
        createdAt: expect.any(Date),
      })
    })

    it('should update an existing SurveyResult with new answer', async () => {
      // Arrange
      const sut = new SurveyResultMongoRepository()
      const existingSurveyResult = await surveyResultFactory.create()
      const saveSurveyResultInput: SaveSurveyResultInput = {
        accountId: existingSurveyResult.accountId.toString(),
        answer: 'updated_answer',
        surveyId: existingSurveyResult.surveyId.toString(),
      }

      // Act
      const surveyResult = await sut.createOrUpdate(saveSurveyResultInput)

      // Assert
      expect(surveyResult).toEqual({
        id: existingSurveyResult._id.toString(),
        ...saveSurveyResultInput,
        createdAt: expect.any(Date),
      })
    })
  })
})
