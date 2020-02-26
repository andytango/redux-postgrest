import { HttpRequestConfig, HttpResponse } from "./http"
import "isomorphic-fetch"

export function httpFetch(config: HttpRequestConfig): Promise<HttpResponse> {
  const { url, method, body, headers } = config
  return fetch(url, {
    method,
    body: body ? JSON.stringify(body) : null,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
  }).then(res =>
    res
      .json()
      .catch(() => undefined)
      .then(body => ({
        body,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        url,
      })),
  )
}
