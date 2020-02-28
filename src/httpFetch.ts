import { HttpRequestConfig, HttpResponse } from "./http"
import "isomorphic-fetch"

export function httpFetch(config: HttpRequestConfig): Promise<HttpResponse> {
  const { url } = config
  return fetch(url, getDefaultFetchConfig(config)).then(
    handleFetchResponse(url),
  )
}

export function getDefaultFetchConfig(config: HttpRequestConfig): RequestInit {
  const { method, body, headers } = config
  return {
    method,
    body: body ? JSON.stringify(body) : null,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
  }
}

export function handleFetchResponse(url: string) {
  return (res: Response) =>
    res
      .json()
      .catch(() => undefined)
      .then(body => ({
        body,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        url,
      }))
}
