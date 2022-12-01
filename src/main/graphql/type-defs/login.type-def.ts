import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    login(loginInput: LoginInput!): Account!
  }

  extend type Mutation {
    signUp(signupInput: SignupInput!): Account!
  }

  type Account {
    accessToken: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
    passwordConfirmation: String!
  }
`

export interface LoginArgs {
  loginInput: LoginInput
}

export interface LoginInput {
  email: string
  password: string
}

export interface SignUpArgs {
  signupInput: SignUpInput
}

export interface SignUpInput {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}
