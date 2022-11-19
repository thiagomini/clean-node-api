import { HttpResponse } from '.'

export interface Controller<TRequest = any> {
  handle(request: TRequest): Promise<HttpResponse>
}
