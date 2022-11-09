import { LoadSurveySummaryUseCase } from '@/domain/use-cases/survey/load-survey-summary'
import { ok } from '@/presentation/utils/http-responses-factories'
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
    await this.loadSurveySummaryUseCase.load(httpRequest.params?.surveyId)

    return ok({})
  }
}
