import {
  InvalidSurveyAnswerError,
  NonexistentAccountError,
  NonexistentSurveyError,
} from '../../../../domain/use-cases/survey-result/save-survey-result/errors'
import {
  badRequest,
  internalServerError,
  noContent,
  notFound,
} from '../../../utils/http-responses-factories'
import {
  Controller,
  HttpResponse,
  SaveSurveyResultUseCase,
  HttpRequest,
} from './save-survey-result-controller.protocols'

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly saveSurveyResultUseCase: SaveSurveyResultUseCase
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { answer } = httpRequest.body
      const { accountId } = httpRequest
      const surveyId = httpRequest.params?.surveyId

      await this.saveSurveyResultUseCase.save({
        accountId: accountId as string,
        answer,
        surveyId,
      })

      return noContent()
    } catch (err) {
      return this.handleError(err as Error, httpRequest)
    }
  }

  private handleError(err: Error, httpRequest: HttpRequest): HttpResponse {
    if (err instanceof NonexistentAccountError) {
      return notFound({
        cause: err as Error,
        entityName: 'Account',
        missingId: httpRequest.body?.accountId,
      })
    }

    if (err instanceof NonexistentSurveyError) {
      return notFound({
        cause: err,
        entityName: 'SurveyResult',
        missingId: httpRequest.params?.surveyId,
      })
    }

    if (err instanceof InvalidSurveyAnswerError) {
      return badRequest(err)
    }

    return internalServerError(err)
  }
}
