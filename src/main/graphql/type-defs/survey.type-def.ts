import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    surveys: [Survey!]! @auth
  }

  type Survey {
    id: String!
    question: String!
    answers: [Answer!]!
    createdAt: Date
  }

  type Answer {
    image: String
    answer: String!
  }
`
