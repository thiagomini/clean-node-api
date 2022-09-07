import { badRequest } from '../../../utils/http-responses-factories'
import { Controller, HttpRequest, HttpResponse, Validation } from './add-survey-controller.protocols'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest<any>): Promise<HttpResponse> {
    const errorOrUndefined = this.validation.validate(httpRequest.body)

    if (errorOrUndefined) {
      return badRequest(errorOrUndefined)
    }

    return {
      body: {},
      statusCode: 200
    }
  }
}
