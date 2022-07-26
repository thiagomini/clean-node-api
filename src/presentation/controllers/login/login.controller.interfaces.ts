import { HttpRequest } from '../../protocols'

export interface LoginControllerRequestBody {
  email: string
  password: string
}

export type LoginControllerRequest = HttpRequest<LoginControllerRequestBody>
