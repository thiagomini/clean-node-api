import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    surveySummary(surveyId: String!): SurveySummary! @auth
  }

  type SurveySummary {
    surveyId: String!
    question: String!
    answers: [SurveyAnswerSummary!]!
    createdAt: Date
  }

  type SurveyAnswerSummary {
    image: String
    answer: String!
    count: Int!
    percent: Int!
  }
`
