import { LoadSurveysController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { decorateWithLogger } from '@/main/factories/decorators'
import { createLoadAccountUseCase } from '@/main/factories/use-cases'

export const createLoadSurveysController = (): Controller => {
  const loadAccountUseCase = createLoadAccountUseCase()
  const loadSurveysController = new LoadSurveysController(loadAccountUseCase)

  return decorateWithLogger(loadSurveysController)
}
