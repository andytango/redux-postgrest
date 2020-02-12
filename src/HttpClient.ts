export interface HttpResponse {
  data: Object
}

export interface HttpClient {
  get: (url: String) => Promise<HttpResponse>
  post: (url: String) => Promise<HttpResponse>
  patch: (url: String) => Promise<HttpResponse>
  delete: (url: String) => Promise<HttpResponse>
}
