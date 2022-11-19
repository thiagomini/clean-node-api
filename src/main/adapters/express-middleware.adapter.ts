import { Middleware } from '@/presentation/protocols'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { AUTH_HEADER } from '@/presentation/middlewares'

export const adaptMiddleware = (middleware: Middleware): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest = {
      accessToken: req.headers?.[AUTH_HEADER],
      ...(req.headers ?? {}),
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
