import { HttpRequestConfig, HttpResponse } from "./http"
import "isomorphic-fetch"

export function httpFetch(config: HttpRequestConfig): Promise<HttpResponse> {
  const { url, method, body } = config
  return fetch(url, {
    method,
    body: body ? JSON.stringify(body) : null,
  }).then(res =>
    res.json().then(body => ({
      body,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      url,
    })),
  )
}
