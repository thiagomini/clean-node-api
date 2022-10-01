import { HttpRequest, Middleware } from '@/presentation/protocols'
import { NextFunction, Request, RequestHandler, Response } from 'express'

export const adaptMiddleware = (middleware: Middleware): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers,
    }

    const response = await middleware.handle(httpRequest)

    res.status(response.statusCode)

    if (response.statusCode >= 200 && response.statusCode < 300) {
      Object.assign(req, response.body)
      next()
    } else {
      res.json({
        error: response.body.message,
      })
    }
  }
}
