import { Controller } from '@/presentation/protocols'
import { LoadSurveySummaryController } from '@/presentation/controllers'
import { decorateWithLogger } from '@/main/factories/decorators'
import { createLoadSurveySummaryUseCase } from '@/main/factories/use-cases'

export const createLoadSurveySummaryController = (): Controller => {
  const loadSurveySummaryUseCase = createLoadSurveySummaryUseCase()
  const loadSurveysController = new LoadSurveySummaryController(
    loadSurveySummaryUseCase
  )

  return decorateWithLogger(loadSurveysController)
}
