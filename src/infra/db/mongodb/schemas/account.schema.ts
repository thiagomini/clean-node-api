import { ObjectId } from 'mongodb'

export interface AccountSchema {
  _id: ObjectId
  name: string
  email: string
  password: string
  accessToken?: string
  role: string
}
