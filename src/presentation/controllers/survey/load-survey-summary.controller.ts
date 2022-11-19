import { NonexistentSurveyError } from '@/domain/use-cases/survey-result/save-survey-result'
import { LoadSurveySummaryUseCase } from '@/domain/use-cases/survey/load-survey-summary'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import {
  ok,
  notFound,
  internalServerError,
} from '@/presentation/utils/http-responses-factories'

export class LoadSurveySummaryController implements Controller {
  constructor(
    private readonly loadSurveySummaryUseCase: LoadSurveySummaryUseCase
  ) {}

  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse> {
    try {
      const surveySummary = await this.loadSurveySummaryUseCase.load(
        httpRequest.params?.surveyId
      )

      return ok(surveySummary)
    } catch (error) {
      if (error instanceof NonexistentSurveyError) {
        return notFound({
          cause: error,
          entityName: 'Survey',
          missingId: httpRequest.params?.surveyId,
        })
      }

      return internalServerError(error as Error)
    }
  }
}
