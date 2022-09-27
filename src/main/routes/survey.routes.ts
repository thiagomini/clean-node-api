import { Router } from 'express'
import { Role } from '../../auth'
import { adaptMiddleware } from '../adapters/express-middleware.adapter'
import { adaptRoute } from '../adapters/express-routes.adapter'
import { createAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller.factory'
import { createLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-controller.factory'
import { createAuthMiddleware } from '../factories/middlewares/auth.middleware.factory'

const addSurveyController = createAddSurveyController()
const adminAuthMiddleware = createAuthMiddleware(Role.Admin)

const loadSurveysController = createLoadSurveysController()
const userAuthMiddleware = createAuthMiddleware()

export default async (router: Router): Promise<void> => {
  router.post(
    '/surveys',
    adaptMiddleware(adminAuthMiddleware),
    adaptRoute(addSurveyController)
  )

  router.get(
    '/surveys',
    adaptMiddleware(userAuthMiddleware),
    adaptRoute(loadSurveysController)
  )
}
