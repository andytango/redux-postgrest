export interface HttpResponse {
  data: object
  status: number
  statusText: string
  headers: object
}

export interface HttpRequestConfig {
  method: HttpMethod
  url: string
  data?: object
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
