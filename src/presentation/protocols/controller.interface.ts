import { HttpRequest, HttpResponse } from '.'

export interface Controller {
  handle: (httpRequest: HttpRequest) => HttpResponse | undefined
}
