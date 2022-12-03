import { adaptResolver } from '../../adapters/apollo-server-resolver.adapter'
import { createLoginController, createSignupController } from '../../factories'
import {
  LoginArgs,
  LoginInput,
  SignUpArgs,
  SignUpInput,
} from '../type-defs/login.type-def'

export default {
  Query: {
    login: async (_parent: never, args: LoginArgs) =>
      await adaptResolver<LoginInput>({
        controller: createLoginController(),
        input: args.loginInput,
      }),
  },

  Mutation: {
    signUp: async (_parent: never, args: SignUpArgs) =>
      await adaptResolver<SignUpInput>({
        controller: createSignupController(),
        input: args.signupInput,
      }),
  },
}
