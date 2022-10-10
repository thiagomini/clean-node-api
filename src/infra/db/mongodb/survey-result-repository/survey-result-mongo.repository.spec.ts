import { SurveyModel } from '@/domain/models'
import { SaveSurveyResultInput } from '@/domain/use-cases/save-survey-result'
import { ObjectId } from 'mongodb'
import { NonexistentAccountError } from '@/domain/use-cases/save-survey-result/errors'
import { MongoEntityFactory } from '../helpers/factories/mongo-entity.factory'
import { createSurveysFactory } from '../helpers/factories/mongo-surveys.factory'
import { SurveyResultMongoRepository } from './survey-result-mongo.repository'
import { clearSurveysCollection } from '../helpers/test-teardown-helpers'
import { mongoHelper } from '../helpers/mongo-helper'

describe('SurveyResultMongoRepository', () => {
  let mongoSurveyFactory: MongoEntityFactory<SurveyModel>

  beforeAll(async () => {
    mongoSurveyFactory = await createSurveysFactory()
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
      const survey = await mongoSurveyFactory.create()
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
  })
})
