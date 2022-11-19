import { Router } from 'express'
import { adaptRoute } from '../adapters/express-routes.adapter'
import { createSaveSurveyResultController } from '../factories/controllers/survey-result/save-survey-result/save-survey-result-controller.factory'
import { userAuthMiddleware } from '../middlewares'
import { transformSaveSurveyRequest } from './transformers/save-survey-result.transformer'

const saveSurveyResultController = createSaveSurveyResultController()

export default async (router: Router): Promise<void> => {
  router.put(
    '/surveys/:surveyId',
    userAuthMiddleware,
    adaptRoute(saveSurveyResultController, transformSaveSurveyRequest)
  )
}
