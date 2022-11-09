import { LoadSurveySummaryUseCase } from '@/domain/use-cases/survey/load-survey-summary'
import { notFound, ok } from '@/presentation/utils/http-responses-factories'
import { NonexistentSurveyError } from '../../../../domain/use-cases/survey-result/save-survey-result/errors'
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../add-survey/add-survey-controller.protocols'

export class LoadSurveySummaryController implements Controller {
  constructor(
    private readonly loadSurveySummaryUseCase: LoadSurveySummaryUseCase
  ) {}

  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse> {
    try {
      await this.loadSurveySummaryUseCase.load(httpRequest.params?.surveyId)
    } catch (error) {
      if (error instanceof NonexistentSurveyError) {
        return notFound({
          cause: error,
          entityName: 'Survey',
          missingId: httpRequest.params?.surveyId,
        })
      }
    }

    return ok({})
  }
}
