export interface HttpResponse {
  body: object
  status: number
  statusText: string
  headers: Headers
}

export interface HttpRequestConfig {
  method: HttpMethod
  url: string
  body?: object
  headers?: object
}

export type HttpClient = (config: HttpRequestConfig) => Promise<HttpResponse>

export enum HttpKind {
  REQUEST = "REQUEST",
  RESPONSE = "RESPONSE",
  ERROR = "ERROR",
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PATCH = "PATCH",
}
