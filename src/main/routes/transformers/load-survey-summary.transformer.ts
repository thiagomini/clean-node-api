import { Request } from 'express'
import { RequestTransformer } from '@/main/adapters/request-transformer.interface'
import { LoadSurveySummaryController } from '@/presentation/controllers'

export const transformLoadSurveySummaryRequest: RequestTransformer = (
  httpRequest: Request
): LoadSurveySummaryController.Request => ({
  surveyId: httpRequest.params?.surveyId,
})
