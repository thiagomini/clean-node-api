import { LogErrorRepository } from '@/data/protocols/db/log-repository'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  HttpStatusCodes,
} from '@/presentation/protocols'

export class LogDecoratorController implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logRepository: LogErrorRepository
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const controllerResponse = await this.controller.handle(httpRequest)

    if (
      controllerResponse?.statusCode === HttpStatusCodes.INTERNAL_SERVER_ERROR
    ) {
      await this.logRepository.error(controllerResponse?.body)
    }

    return controllerResponse
  }
}
