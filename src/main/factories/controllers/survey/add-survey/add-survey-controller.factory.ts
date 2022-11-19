import { AddSurveyController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { decorateWithLogger } from '../../../decorators'
import { createDbAddSurveyUseCase } from '../../../use-cases/survey'
import { createAddSurveyValidation } from './add-survey-validation.factory'

export const createAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(
    createAddSurveyValidation(),
    createDbAddSurveyUseCase()
  )
  return decorateWithLogger(controller)
}
