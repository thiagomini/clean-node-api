import { HttpResponse } from './http'
import { HttpStatusCodes } from './http-status-codes'

export function badRequest (error: Error): HttpResponse {
  return {
    statusCode: HttpStatusCodes.BAD_REQUEST,
    body: error
  }
}
