import { noContent, notFound } from '../../../utils/http-responses-factories'
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
      const { answer, accountId } = httpRequest.body
      const surveyId = httpRequest.params?.surveyId

      await this.saveSurveyResultUseCase.save({
        accountId,
        answer,
        surveyId,
      })

      return noContent()
    } catch (err) {
      return notFound({
        cause: err as Error,
        entityName: 'SurveyResult',
        missingId: httpRequest.params?.surveyId,
      })
    }
  }
}
