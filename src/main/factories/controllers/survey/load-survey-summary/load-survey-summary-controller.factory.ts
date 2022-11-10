import { Controller } from '@/presentation/protocols'
import { LoadSurveySummaryController } from '../../../../../presentation/controllers/survey/load-survey-summary/load-survey-summary.controller'
import { decorateWithLogger } from '../../../decorators'
import { createLoadSurveySummaryUseCase } from '../../../use-cases'

export const createLoadSurveySummaryController = (): Controller => {
  const loadSurveySummaryUseCase = createLoadSurveySummaryUseCase()
  const loadSurveysController = new LoadSurveySummaryController(
    loadSurveySummaryUseCase
  )

  return decorateWithLogger(loadSurveysController)
}
