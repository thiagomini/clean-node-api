import { AccountModel, SurveyModel } from '@/domain/models'
import { SaveSurveyResultInput } from '@/domain/use-cases/survey-result/save-survey-result'
import { createAccountFactory } from '../helpers/factories/mongo-account.factory'
import { MongoEntityFactory } from '../helpers/factories/mongo-entity.factory'
import {
  createSurveyResultFactory,
  MongoSurveyResultFactory,
} from '../helpers/factories/mongo-survey-result.factory'
import { createSurveysFactory } from '../helpers/factories/mongo-surveys.factory'
import { mongoHelper } from '../helpers/mongo-helper'
import { clearSurveysCollection } from '../helpers/test-teardown-helpers'
import { SurveyResultMongoRepository } from './survey-result-mongo.repository'

describe('SurveyResultMongoRepository', () => {
  let surveyFactory: MongoEntityFactory<SurveyModel>
  let accountFactory: MongoEntityFactory<AccountModel>
  let surveyResultFactory: MongoSurveyResultFactory

  beforeAll(async () => {
    surveyFactory = await createSurveysFactory()
    accountFactory = await createAccountFactory()
    surveyResultFactory = await createSurveyResultFactory()
  })

  afterEach(async () => {
    await clearSurveysCollection()
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
        accountId: existingAccount.id,
        answer: 'valid_answer',
        surveyId: existingSurvey.id,
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
        accountId: existingSurveyResult.accountId,
        answer: 'updated_answer',
        surveyId: existingSurveyResult.surveyId,
      }

      // Act
      const surveyResult = await sut.createOrUpdate(saveSurveyResultInput)

      // Assert
      expect(surveyResult).toEqual({
        id: existingSurveyResult.id,
        ...saveSurveyResultInput,
        createdAt: expect.any(Date),
      })
    })
  })
})
