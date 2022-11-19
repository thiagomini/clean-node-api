import { Request } from 'express'
import { RequestTransformer } from '@/main/adapters/request-transformer.interface'
import { AddSurveyController } from '@/presentation/controllers'

export const transformAddSurveyRequest: RequestTransformer = (
  httpRequest: Request
): AddSurveyController.Request => ({
  answers: httpRequest.body.answers,
  question: httpRequest.body.question,
})
