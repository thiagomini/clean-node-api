import { ObjectId } from 'mongodb'
import { ContextError } from '../../../../errors'
import { mongoHelper } from '../helpers/mongo-helper'
import { clearErrorLogsCollection } from '../helpers/test-teardown-helpers'
import { LogMongoRepository } from './log-mongo.repository'

describe('LogMongoRepository', () => {
  beforeAll(async () => {
    await mongoHelper.connect(String(process.env.MONGO_URL))
  })

  beforeEach(async () => {
    await clearErrorLogsCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  it('should save an error log for common Error instances', async () => {
    const logRepository = new LogMongoRepository()
    const error = new Error('Some Error Occurred')

    await logRepository.error(error)

    const errorLog = await (await mongoHelper.getCollection('errors')).findOne()

    expect(errorLog).toEqual({
      _id: expect.any(ObjectId),
      name: error.name,
      stack: error.stack,
      cause: null,
      context: {},
      createdAt: expect.any(Date)
    })
  })

  it('should save an error log for ContextError instances with a context', async () => {
    const logRepository = new LogMongoRepository()
    const error = new ContextError({
      message: 'Some error occurred',
      context: {
        key: 'value'
      },
      errorName: 'CustomName'
    })

    await logRepository.error(error)

    const errorLog = await (await mongoHelper.getCollection('errors')).findOne()

    expect(errorLog).toEqual({
      _id: expect.any(ObjectId),
      name: error.name,
      stack: error.stack,
      cause: null,
      context: error.context,
      createdAt: expect.any(Date)
    })
  })
})
