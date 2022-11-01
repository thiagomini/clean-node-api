import { ObjectId } from 'mongodb'

export interface SurveyResultSchema {
  _id: ObjectId
  surveyId: ObjectId
  accountId: ObjectId
  answer: string
  createdAt: Date
}
