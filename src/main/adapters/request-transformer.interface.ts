import { Request } from 'express'
export type RequestTransformer<TResult = any> = (
  httpRequest: Request
) => TResult
