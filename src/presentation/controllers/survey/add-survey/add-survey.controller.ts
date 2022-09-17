import {
  badRequest,
  internalServerError,
  noContent,
} from '../../../utils/http-responses-factories'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
  AddSurveyUseCase,
} from './add-survey-controller.protocols'

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurveyUseCase: AddSurveyUseCase
  ) {}

  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse> {
    try {
      return await this.createSurvey(httpRequest)
    } catch (err) {
      return internalServerError(err as Error)
    }
  }

  private async createSurvey(httpRequest: HttpRequest): Promise<HttpResponse> {
    const errorOrUndefined = this.validation.validate(httpRequest.body)

    if (errorOrUndefined) {
      return badRequest(errorOrUndefined)
    }

    const { question, answers } = httpRequest.body

    await this.addSurveyUseCase.add({
      question,
      answers,
    })

    return noContent()
  }
}
