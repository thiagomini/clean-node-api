import { LoginInput } from '@/main/graphql/type-defs/login.type-def'
import { GqlHttpRequest } from './gql-http-request'

export class QueryBuilder {
  public loginUser(loginInput: LoginInput): GqlHttpRequest {
    const queryData = {
      query: `query loginUser($loginInput: LoginInput!) {
        login(loginInput: $loginInput) { 
          accessToken
        }
      }`,
      variables: {
        loginInput,
      },
    }

    return queryData
  }

  public surveys(): GqlHttpRequest {
    const queryData = {
      query: `query Surveys {
        surveys { 
          id
          question
          answers {
            image
            answer
          },
          createdAt
        }
      }`,
    }

    return queryData
  }

  public surveySummary(surveyId: string): GqlHttpRequest {
    const queryData = {
      query: `query loginUser($surveyId: String!) {
        surveySummary(surveyId: $surveyId) { 
          surveyId
          question
          answers {
            image
            answer
            count
            percent
          }
          createdAt
        }
      }`,
      variables: {
        surveyId,
      },
    }

    return queryData
  }
}
