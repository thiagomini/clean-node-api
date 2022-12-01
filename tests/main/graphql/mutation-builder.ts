import { SignUpInput } from '@/main/graphql/type-defs/login.type-def'
import { GqlHttpRequest } from './gql-http-request'

export class MutationBuilder {
  public signupUser(signupInput: SignUpInput): GqlHttpRequest {
    const queryData = {
      query: `mutation signUp($signupInput: SignupInput!) {
        signUp(signupInput: $signupInput) { 
          accessToken
        }
      }`,
      variables: {
        signupInput,
      },
    }

    return queryData
  }
}
