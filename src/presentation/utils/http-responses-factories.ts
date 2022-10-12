import { ServerError, UnauthorizedError } from '../errors'
import { NotFoundError } from '../errors/not-found.error'
import { HttpResponse, HttpStatusCodes } from '../protocols'

export function badRequest(error: Error): HttpResponse {
  return {
    statusCode: HttpStatusCodes.BAD_REQUEST,
    body: error,
  }
}

export function internalServerError(error: Error): HttpResponse {
  return {
    statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    body: new ServerError(error),
  }
}

export function ok<T = unknown>(body: T): HttpResponse {
  return {
    statusCode: HttpStatusCodes.OK,
    body,
  }
}

export function unauthorized(): HttpResponse {
  return {
    statusCode: HttpStatusCodes.UNAUTHORIZED,
    body: new UnauthorizedError(),
  }
}

export function forbidden(error: Error): HttpResponse {
  return {
    statusCode: HttpStatusCodes.FORBIDDEN,
    body: error,
  }
}

export function noContent(): HttpResponse {
  return {
    statusCode: HttpStatusCodes.NO_CONTENT,
    body: null,
  }
}

export interface NotFoundInput {
  entityName: string
  missingId: string
  cause: Error
}

export function notFound(input: NotFoundInput): HttpResponse {
  return {
    statusCode: HttpStatusCodes.NOT_FOUND,
    body: new NotFoundError(input),
  }
}
