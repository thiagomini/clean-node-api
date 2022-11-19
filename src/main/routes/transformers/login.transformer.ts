import { Request } from 'express'
import { LoginController } from '@/presentation/controllers'
import { RequestTransformer } from '@/main/adapters/request-transformer.interface'

export const transformLoginRequest: RequestTransformer = (
  httpRequest: Request
): LoginController.Request => ({
  email: httpRequest.body.email,
  password: httpRequest.body.password,
})
