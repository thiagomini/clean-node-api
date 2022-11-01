import { ObjectId } from 'mongodb'

export interface SurveyResultSchema {
  surveyId: ObjectId
  accountId: ObjectId
  answer: string
  createdAt: Date
}
