import { AxiosInstance } from "axios"

export interface HttpResponse {
  data: object
  status: number
  statusText: string
  headers: object
}

export interface HttpClient extends AxiosInstance {}

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
