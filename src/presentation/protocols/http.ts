export interface HttpResponse {
  statusCode: number
  body: any
}

export interface HttpRequest<T = any> {
  body?: T
  headers?: Record<string, any>
}
