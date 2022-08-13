import { Router } from 'express'
import { adaptRoute } from '../adapters/express-routes.adapter'
import { createSignupController, createLoginController } from '../factories'

const signupController = createSignupController()
const loginController = createLoginController()

export default (router: Router): void => {
  router.post('/signup', adaptRoute(signupController))
  router.post('/login', adaptRoute(loginController))
}
