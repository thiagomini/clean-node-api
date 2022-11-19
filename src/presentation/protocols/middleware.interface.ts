import { HttpResponse } from './http.interface'

export interface Middleware<TRequest = any> {
  handle(httpRequest: TRequest): Promise<HttpResponse>
}
