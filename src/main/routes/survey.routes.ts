import { Router } from 'express'
import { adaptRoute } from '../adapters/express-routes.adapter'
import { createAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller.factory'
import { createLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-controller.factory'
import { adminAuthMiddleware, userAuthMiddleware } from '../middlewares'

const addSurveyController = createAddSurveyController()
const loadSurveysController = createLoadSurveysController()

export default async (router: Router): Promise<void> => {
  router.post('/surveys', adminAuthMiddleware, adaptRoute(addSurveyController))

  router.get('/surveys', userAuthMiddleware, adaptRoute(loadSurveysController))
}
