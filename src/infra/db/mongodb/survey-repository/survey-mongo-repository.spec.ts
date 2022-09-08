import { mongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo.repository'
import { clearSurveysCollection } from '../helpers/test-teardown-helpers'
import { getSurveysCollection } from '../helpers/collections'

describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await mongoHelper.connect()
  })

  beforeEach(async () => {
    await clearSurveysCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  describe('add', () => {
    it('should create a survey on success', async () => {
      const sut = await createSut()

      const survey = await sut.add({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          }
        ]
      })

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
    })
  })
})

const createSut = async (): Promise<SurveyMongoRepository> => {
  const surveysCollection = await getSurveysCollection()
  return new SurveyMongoRepository(surveysCollection)
}
