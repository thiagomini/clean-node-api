import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogDecoratorController implements Controller {
  constructor (private readonly controller: Controller) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.controller.handle(httpRequest)

    return {
      body: {},
      statusCode: 200
    }
  }
}
