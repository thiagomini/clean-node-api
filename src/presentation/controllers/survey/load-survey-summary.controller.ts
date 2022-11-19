import { NonexistentSurveyError } from '@/domain/use-cases/survey-result/save-survey-result'
import { LoadSurveySummaryUseCase } from '@/domain/use-cases/survey/load-survey-summary'
import { Controller, HttpResponse } from '@/presentation/protocols'
import {
  internalServerError,
  notFound,
  ok,
} from '@/presentation/utils/http-responses-factories'

export class LoadSurveySummaryController implements Controller {
  constructor(
    private readonly loadSurveySummaryUseCase: LoadSurveySummaryUseCase
  ) {}

  async handle(
    request: LoadSurveySummaryController.Request
  ): Promise<HttpResponse> {
    try {
      const surveySummary = await this.loadSurveySummaryUseCase.load(
        request.surveyId
      )

      return ok(surveySummary)
    } catch (error) {
      if (error instanceof NonexistentSurveyError) {
        return notFound({
          cause: error,
          entityName: 'Survey',
          missingId: request.surveyId,
        })
      }

      return internalServerError(error as Error)
    }
  }
}

export namespace LoadSurveySummaryController {
  export interface Request {
    surveyId: string
  }
}
