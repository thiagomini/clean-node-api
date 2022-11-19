import { SaveSurveyResultUseCase } from '@/domain/use-cases/survey-result/save-survey-result'
import {
  InvalidSurveyAnswerError,
  NonexistentAccountError,
  NonexistentSurveyError,
} from '@/domain/use-cases/survey-result/save-survey-result/errors'
import { Controller, HttpResponse } from '@/presentation/protocols'
import {
  badRequest,
  internalServerError,
  noContent,
  notFound,
} from '@/presentation/utils/http-responses-factories'

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly saveSurveyResultUseCase: SaveSurveyResultUseCase
  ) {}

  async handle(
    request: SaveSurveyResultController.Request
  ): Promise<HttpResponse> {
    try {
      return await this.upsertSurveyResult(request)
    } catch (err) {
      return this.handleError(err as Error, request)
    }
  }

  private async upsertSurveyResult(
    request: SaveSurveyResultController.Request
  ): Promise<HttpResponse> {
    const { answer } = request
    const { accountId } = request
    const surveyId = request.surveyId

    await this.saveSurveyResultUseCase.save({
      accountId: accountId,
      answer,
      surveyId,
    })

    return noContent()
  }

  private handleError(
    err: Error,
    httpRequest: SaveSurveyResultController.Request
  ): HttpResponse {
    if (err instanceof NonexistentAccountError) {
      return notFound({
        cause: err as Error,
        entityName: 'Account',
        missingId: httpRequest.accountId,
      })
    }

    if (err instanceof NonexistentSurveyError) {
      return notFound({
        cause: err,
        entityName: 'Survey',
        missingId: httpRequest.surveyId,
      })
    }

    if (err instanceof InvalidSurveyAnswerError) {
      return badRequest(err)
    }

    return internalServerError(err)
  }
}

export namespace SaveSurveyResultController {
  export interface Request {
    accountId: string
    answer: string
    surveyId: string
  }
}
