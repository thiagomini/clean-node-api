import { AddSurveyUseCase } from '@/domain/use-cases/survey/add-survey'
import { Controller, Validation, HttpResponse } from '@/presentation/protocols'
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

  async handle(request: AddSurveyController.Request): Promise<HttpResponse> {
    try {
      return await this.createSurvey(request)
    } catch (err) {
      return internalServerError(err as Error)
    }
  }

  private async createSurvey(
    request: AddSurveyController.Request
  ): Promise<HttpResponse> {
    const errorOrUndefined = this.validation.validate(request)

    if (errorOrUndefined) {
      return badRequest(errorOrUndefined)
    }

    const { question, answers } = request

    await this.addSurveyUseCase.add({
      question,
      answers,
    })

    return noContent()
  }
}

export namespace AddSurveyController {
  export interface Request {
    question: string
    answers: Answer[]
  }

  interface Answer {
    image?: string
    answer: string
  }
}
