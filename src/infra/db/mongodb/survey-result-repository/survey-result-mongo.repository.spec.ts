import { AccountModel, SurveyModel } from '@/domain/models'
import { SaveSurveyResultInput } from '@/domain/use-cases/save-survey-result'
import {
  NonexistentAccountError,
  NonexistentSurveyError,
} from '@/domain/use-cases/save-survey-result/errors'
import { ObjectId } from 'mongodb'
import { createAccountFactory } from '../helpers/factories/mongo-account.factory'
import { MongoEntityFactory } from '../helpers/factories/mongo-entity.factory'
import { createSurveysFactory } from '../helpers/factories/mongo-surveys.factory'
import { mongoHelper } from '../helpers/mongo-helper'
import { clearSurveysCollection } from '../helpers/test-teardown-helpers'
import { SurveyResultMongoRepository } from './survey-result-mongo.repository'

describe('SurveyResultMongoRepository', () => {
  let surveyFactory: MongoEntityFactory<SurveyModel>
  let accountFactory: MongoEntityFactory<AccountModel>

  beforeAll(async () => {
    surveyFactory = await createSurveysFactory()
    accountFactory = await createAccountFactory()
  })

  afterEach(async () => {
    await clearSurveysCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  describe('createOrUpdate', () => {
    it('should throw a NonexistentAccountError when the account does not exist', async () => {
      // Arrange
      const sut = new SurveyResultMongoRepository()
      const survey = await surveyFactory.create()
      const saveSurveyResultInput: SaveSurveyResultInput = {
        accountId: new ObjectId().toString(),
        answer: 'valid_answer',
        surveyId: survey.id,
      }

      // Act & Assert
      await expect(
        sut.createOrUpdate(saveSurveyResultInput)
      ).rejects.toThrowError(NonexistentAccountError)
    })

    it('should throw a NonexistentSurveyError when the survey does not exist', async () => {
      // Arrange
      const sut = new SurveyResultMongoRepository()
      const nonexistentSurveyId = new ObjectId().toString()
      const existingAccount = await accountFactory.create()

      const saveSurveyResultInput: SaveSurveyResultInput = {
        accountId: existingAccount.id,
        answer: 'valid_answer',
        surveyId: nonexistentSurveyId,
      }

      // Act & Assert
      await expect(
        sut.createOrUpdate(saveSurveyResultInput)
      ).rejects.toThrowError(NonexistentSurveyError)
    })

    it('should create a new SurveyResult entry if account and survey exist', async () => {
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
      await expect(
        sut.createOrUpdate(saveSurveyResultInput)
      ).resolves.toBeUndefined()
    })
  })
})
