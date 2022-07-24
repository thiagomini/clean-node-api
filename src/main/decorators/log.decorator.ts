import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogDecoratorController implements Controller {
  constructor (private readonly controller: Controller) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const controllerResponse = await this.controller.handle(httpRequest)

    return controllerResponse
  }
}
