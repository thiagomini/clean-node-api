import { AddSurveyUseCase } from '@/domain/use-cases/survey/add-survey'
import {
  Controller,
  Validation,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols'
import {
  badRequest,
  internalServerError,
  noContent,
} from '@/presentation/utils/http-responses-factories'

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
