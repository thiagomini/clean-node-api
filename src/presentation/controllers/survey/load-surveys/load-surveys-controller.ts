import { LoadSurveysUseCase } from '../../../../domain/use-cases/load-surveys'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  HttpStatusCodes,
} from './load-surveys.protocols'

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveysUseCase: LoadSurveysUseCase) {}

  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse> {
    await this.loadSurveysUseCase.load()
    return {
      body: {},
      statusCode: HttpStatusCodes.OK,
    }
  }
}
