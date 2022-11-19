import { Request, RequestHandler, Response } from 'express'
import { Controller } from '@/presentation/protocols'
import { RequestTransformer } from './request-transformer.interface'
import { transformRequest } from './default-request-transformer'

export const adaptRoute = (
  controller: Controller,
  requestTransformer: RequestTransformer = transformRequest
): RequestHandler => {
  return async (req: Request, res: Response) => {
    const transformedRequest = requestTransformer(req)
    transformedRequest.accountId = req.accountId

    const response = await controller.handle(transformedRequest)

    res.status(response.statusCode).json(response.body)
  }
}
