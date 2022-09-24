import {
  Controller,
  HttpRequest,
  HttpResponse,
  HttpStatusCodes,
  LoadSurveysUseCase,
  internalServerError,
} from './load-surveys.protocols'

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveysUseCase: LoadSurveysUseCase) {}

  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse> {
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
