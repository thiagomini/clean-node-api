import { Router } from 'express'
import { adaptRoute } from '../adapters/express-routes.adapter'
import { createAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller.factory'

const addSurveyController = createAddSurveyController()

export default async (router: Router): Promise<void> => {
  router.post('/surveys', adaptRoute(addSurveyController))
}
