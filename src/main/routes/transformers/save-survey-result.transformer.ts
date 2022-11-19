import { RequestTransformer } from '@/main/adapters/request-transformer.interface'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { Request } from 'express'

export const transformSaveSurveyRequest: RequestTransformer = (
  httpRequest: Request
): SaveSurveyResultController.Request => ({
  accountId: httpRequest.accountId as string,
  answer: httpRequest.body.answer,
  surveyId: httpRequest.params.surveyId,
})
