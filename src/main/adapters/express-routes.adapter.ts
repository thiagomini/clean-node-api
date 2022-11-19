import { Request, RequestHandler, Response } from 'express'
import { Controller } from '@/presentation/protocols'

export const adaptRoute = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response) => {
    const httpRequest = {
      ...(req.body ?? {}),
      ...(req.params ?? {}),
      accountId: req.accountId,
    }

    const response = await controller.handle(httpRequest)

    res.status(response.statusCode).json(response.body)
  }
}
