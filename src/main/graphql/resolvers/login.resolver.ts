import { createLoginController } from '../../factories'
import { LoginArgs } from '../type-defs/login.type-def'

export default {
  Query: {
    async login(_parent: never, args: LoginArgs) {
      const loginController = createLoginController()

      const httpResponse = await loginController.handle(args.loginInput)

      return httpResponse.body
    },
  },
}
