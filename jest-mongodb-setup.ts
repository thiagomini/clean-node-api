import { MongoClient } from 'mongodb'

let client: MongoClient

beforeAll(async () => {
  client = await MongoClient.connect(String(process.env.MONGO_URL))
})

afterAll(async () => {
  await client?.close()
})
