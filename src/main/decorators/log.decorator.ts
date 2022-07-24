import { LogRepository } from '../../data/protocols'
import { Controller, HttpRequest, HttpResponse, HttpStatusCodes } from '../../presentation/protocols'

export class LogDecoratorController implements Controller {
  constructor (private readonly controller: Controller, private readonly logRepository: LogRepository) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const controllerResponse = await this.controller.handle(httpRequest)

    if (controllerResponse?.statusCode === HttpStatusCodes.INTERNAL_SERVER_ERROR) {
      await this.logRepository.error(controllerResponse?.body)
    }

    return controllerResponse
  }
}
