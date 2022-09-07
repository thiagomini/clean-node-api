import { Controller, HttpRequest, HttpResponse, Validation } from './add-survey-controller.protocols'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest<any>): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)
    return {
      body: {},
      statusCode: 200
    }
  }
}
