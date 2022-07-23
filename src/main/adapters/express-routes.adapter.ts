import { Request, RequestHandler, Response } from 'express'
import { Controller, HttpRequest } from '../../presentation/protocols'

export const adaptRoute = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }

    const response = await controller.handle(httpRequest)

    res.status(response.statusCode).json(response.body)
  }
}
