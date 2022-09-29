import { NextFunction, Request, RequestHandler, Response } from 'express'
import {
  HttpRequest,
  HttpStatusCodes,
  Middleware,
} from '@/presentation/protocols'

export const adaptMiddleware = (middleware: Middleware): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers,
    }

    const response = await middleware.handle(httpRequest)

    res.status(response.statusCode)

    if (response.statusCode === HttpStatusCodes.OK) {
      Object.assign(req, response.body)
      next()
    } else {
      res.json({
        error: response.body.message,
      })
    }
  }
}
