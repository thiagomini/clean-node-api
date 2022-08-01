import { Router } from 'express'
import { createSignupController } from '../factories/signup/signup.factory'
import { adaptRoute } from '../adapters/express-routes.adapter'

const signupController = createSignupController()

export default (router: Router): void => {
  router.post('/signup', adaptRoute(signupController))
}
