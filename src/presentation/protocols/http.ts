export interface HttpResponse {
  statusCode: number
  body: any
}

export interface HttpRequest<TBody = any> {
  body?: TBody
  headers?: Record<string, any>
  params?: Record<string, any>
}
