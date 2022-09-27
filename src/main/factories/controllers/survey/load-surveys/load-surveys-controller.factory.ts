import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller'
import { Controller } from '../../../../../presentation/protocols'
import { decorateWithLogger } from '../../../decorators'
import { createLoadAccountUseCase } from '../../../use-cases'

export const createLoadSurveysController = (): Controller => {
  const loadAccountUseCase = createLoadAccountUseCase()
  const loadSurveysController = new LoadSurveysController(loadAccountUseCase)

  return decorateWithLogger(loadSurveysController)
}
