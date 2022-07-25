import { Collection, ObjectId } from 'mongodb'
import { ContextError } from '../../../../errors'
import { mongoHelper } from '../helpers/mongo-helper'
import { clearErrorLogsCollection } from '../helpers/test-teardown-helpers'
import { LogMongoRepository } from './log-mongo.repository'

describe('LogMongoRepository', () => {
  let errorsCollection: Collection

  beforeAll(async () => {
    await mongoHelper.connect(String(process.env.MONGO_URL))
    errorsCollection = await mongoHelper.getCollection('errors')
  })

  beforeEach(async () => {
    await clearErrorLogsCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  it('should save an error log for common Error instances', async () => {
    // Arrange
    const logRepository = new LogMongoRepository()
    const error = new Error('Some Error Occurred')

    // Act
    await logRepository.error(error)

    // Assert
    const errorLog = await errorsCollection.findOne()

    expect(errorLog).toEqual({
      _id: expect.any(ObjectId),
      name: error.name,
      stack: error.stack,
      cause: null,
      context: null,
      createdAt: expect.any(Date)
    })
  })

  it('should save an error log for ContextError instances with a context', async () => {
    // Arrange
    const logRepository = new LogMongoRepository()
    const error = new ContextError({
      message: 'Some error occurred',
      context: {
        key: 'value'
      },
      errorName: 'CustomName'
    })

    // Act
    await logRepository.error(error)

    // Assert
    const errorLog = await errorsCollection.findOne()
    expect(errorLog).toEqual({
      _id: expect.any(ObjectId),
      name: error.name,
      stack: error.stack,
      cause: null,
      context: error.context,
      createdAt: expect.any(Date)
    })
  })

  it('should save an error log for ContextError instances with a cause', async () => {
    // Arrange
    const logRepository = new LogMongoRepository()
    const error = new ContextError({
      message: 'Some error occurred',
      cause: new Error('Some inner error cause'),
      errorName: 'CustomName'
    })

    // Act
    await logRepository.error(error)

    // Assert
    const errorLog = await errorsCollection.findOne()
    expect(errorLog).toEqual({
      _id: expect.any(ObjectId),
      name: error.name,
      stack: error.stack,
      cause: error.cause?.toString(),
      context: null,
      createdAt: expect.any(Date)
    })
  })
})
