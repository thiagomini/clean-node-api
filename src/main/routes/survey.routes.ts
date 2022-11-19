import { Router } from 'express'
import { adaptRoute } from '../adapters/express-routes.adapter'
import { createAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller.factory'
import { createLoadSurveySummaryController } from '../factories/controllers/survey/load-survey-summary/load-survey-summary-controller.factory'
import { createLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-controller.factory'
import { adminAuthMiddleware, userAuthMiddleware } from '../middlewares'
import {
  transformAddSurveyRequest,
  transformLoadSurveySummaryRequest,
} from './transformers'

const addSurveyController = createAddSurveyController()
const loadSurveysController = createLoadSurveysController()
const loadSurveySummaryController = createLoadSurveySummaryController()

export default async (router: Router): Promise<void> => {
  router.post(
    '/surveys',
    adminAuthMiddleware,
    adaptRoute(addSurveyController, transformAddSurveyRequest)
  )

  router.get('/surveys', userAuthMiddleware, adaptRoute(loadSurveysController))
  router.get(
    '/surveys/:surveyId/summary',
    userAuthMiddleware,
    adaptRoute(loadSurveySummaryController, transformLoadSurveySummaryRequest)
  )
}
