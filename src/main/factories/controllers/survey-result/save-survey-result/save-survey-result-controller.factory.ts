import { Controller } from '@/presentation/protocols'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { decorateWithLogger } from '@/main/factories/decorators'
import { createSaveSurveyResultUseCase } from '@/main/factories/use-cases/survey-result/save-survey-result/save-survey-result-use-case.factory'

export const createSaveSurveyResultController = (): Controller => {
  const saveSurveyResultUseCase = createSaveSurveyResultUseCase()
  const loadSurveysController = new SaveSurveyResultController(
    saveSurveyResultUseCase
  )

  return decorateWithLogger(loadSurveysController)
}
