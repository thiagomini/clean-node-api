import {
  Controller,
  HttpRequest,
  HttpResponse,
  internalServerError,
  LoadSurveySummaryUseCase,
  NonexistentSurveyError,
  notFound,
  ok,
} from './load-survey-summary-controller.protocols'

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
