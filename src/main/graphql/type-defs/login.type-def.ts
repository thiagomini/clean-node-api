import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    login(loginInput: LoginInput!): Account!
  }

  type Account {
    accessToken: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }
`

export interface LoginArgs {
  loginInput: LoginInput
}

export interface LoginInput {
  email: string
  password: string
}
