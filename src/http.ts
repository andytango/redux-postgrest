export interface HttpResponse {
  data: object
  status: number
  statusText: string
  headers: object
}

export interface HttpClient {
  get: (url: String) => Promise<HttpResponse>
  post: (url: String) => Promise<HttpResponse>
  patch: (url: String) => Promise<HttpResponse>
  delete: (url: String) => Promise<HttpResponse>
}

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
