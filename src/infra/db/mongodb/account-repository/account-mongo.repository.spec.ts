import { mongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo.repository'

describe('AccountMongoRepository', () => {
  beforeAll(async () => {
    await mongoHelper.connect(String(process.env.MONGO_URL))
  })

  beforeEach(async () => {
    await clearAccountsCollection()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  it('should return an account on success', async () => {
    const sut = new AccountMongoRepository()

    const account = await sut.add({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })

    expect(account).toEqual({
      id: expect.any(String),
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })
})

async function clearAccountsCollection (): Promise<void> {
  const accountsCollection = await mongoHelper.getCollection('accounts')
  await accountsCollection.deleteMany({})
}
