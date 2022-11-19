import { Router } from 'express'
import { adaptRoute } from '../adapters/express-routes.adapter'
import { createLoginController, createSignupController } from '../factories'
import { transformLoginRequest, transformSignupRequest } from './transformers'

const signupController = createSignupController()
const loginController = createLoginController()

export default (router: Router): void => {
  router.post('/signup', adaptRoute(signupController, transformSignupRequest))
  router.post('/login', adaptRoute(loginController, transformLoginRequest))
}
