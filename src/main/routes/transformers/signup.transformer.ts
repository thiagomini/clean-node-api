import { SignUpController } from '@/presentation/controllers'
import { RequestTransformer } from '@/main/adapters/request-transformer.interface'
import { Request } from 'express'

export const transformSignupRequest: RequestTransformer = (
  httpRequest: Request
): SignUpController.Request => ({
  email: httpRequest.body.email,
  password: httpRequest.body.password,
  name: httpRequest.body.name,
  passwordConfirmation: httpRequest.body.passwordConfirmation,
})
