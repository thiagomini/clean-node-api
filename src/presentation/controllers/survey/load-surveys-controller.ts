import { LoadSurveysUseCase } from '@/domain/use-cases/survey/list-surveys'
import {
  Controller,
  HttpResponse,
  HttpStatusCodes,
} from '@/presentation/protocols'
import { internalServerError } from '@/presentation/utils/http-responses-factories'

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveysUseCase: LoadSurveysUseCase) {}

  async handle(): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveysUseCase.list()
      return {
        body: {
          surveys,
        },
        statusCode: HttpStatusCodes.OK,
      }
    } catch (error) {
      return internalServerError(error as Error)
    }
  }
}
