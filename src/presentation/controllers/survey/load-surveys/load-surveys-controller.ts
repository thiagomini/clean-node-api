import { LoadSurveysUseCase } from '../../../../domain/use-cases/load-surveys'
import { internalServerError } from '../../../utils/http-responses-factories'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  HttpStatusCodes,
} from './load-surveys.protocols'

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveysUseCase: LoadSurveysUseCase) {}

  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse> {
    try {
      await this.loadSurveysUseCase.load()
      return {
        body: {},
        statusCode: HttpStatusCodes.OK,
      }
    } catch (error) {
      return internalServerError(error as Error)
    }
  }
}
