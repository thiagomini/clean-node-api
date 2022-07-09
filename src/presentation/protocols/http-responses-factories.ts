import { ServerError } from '../errors'
import { HttpResponse } from './http'
import { HttpStatusCodes } from './http-status-codes'

export function badRequest (error: Error): HttpResponse {
  return {
    statusCode: HttpStatusCodes.BAD_REQUEST,
    body: error
  }
}

export function internalServerError (error: Error): HttpResponse {
  return {
    statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    body: new ServerError(error)
  }
}

export function ok<T = unknown> (body: T): HttpResponse {
  return {
    statusCode: HttpStatusCodes.OK,
    body
  }
}
