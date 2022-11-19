import { RequestTransformer } from './request-transformer.interface'
import { Request } from 'express'

export const transformRequest: RequestTransformer = (httpRequest: Request) => ({
  accountId: httpRequest.accountId,
})
