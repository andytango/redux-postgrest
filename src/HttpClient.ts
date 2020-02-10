export interface HttpClient {
  get: (url: String) => Promise<Object>
}
