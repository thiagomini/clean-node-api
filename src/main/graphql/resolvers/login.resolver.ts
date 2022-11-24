import { adaptResolver } from '../../adapters/apollo-server-resolver.adapter'
import { createLoginController } from '../../factories'
import { LoginArgs, LoginInput } from '../type-defs/login.type-def'

export default {
  Query: {
    login: async (_parent: never, args: LoginArgs) =>
      await adaptResolver<LoginInput>(createLoginController(), args.loginInput),
  },
}
