import { AddSurveyController } from '../../../../../presentation/controllers/survey/add-survey/add-survey.controller'
import { Controller } from '../../../../../presentation/protocols'
import { decorateWithLogger } from '../../../decorators'
import { createDbAddSurveyUseCase } from '../../../use-cases/add-survey'
import { createAddSurveyValidation } from './add-survey-validation.factory'

export const createAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(
    createAddSurveyValidation(),
    createDbAddSurveyUseCase()
  )
  return decorateWithLogger(controller)
}
