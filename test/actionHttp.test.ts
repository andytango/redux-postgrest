import actionHttp from "../src/actionHttp"
import { createStore, Action } from "redux"
import { identity } from "ramda"
import { HttpMethod, HttpKind } from "../src/http"

describe("actionHttp", () => {
  it("performs a HTTP GET request according to the action metadata", () => {
    const { http, handler } = createMockActionHttp()
    handler(createExampleAction({ method: HttpMethod.GET }))
    expect(http.get).toHaveBeenCalledWith(createExampleUrl())
  })

  it("performs a HTTP POST request according to the action metadata", () => {
    const { http, handler } = createMockActionHttp()
    handler(createExampleAction({ method: HttpMethod.POST }))
    expect(http.post).toHaveBeenCalledWith(createExampleUrl())
  })

  it("performs a HTTP PATCH request according to the action metadata", () => {
    const { http, handler } = createMockActionHttp()
    handler(createExampleAction({ method: HttpMethod.PATCH }))
    expect(http.patch).toHaveBeenCalledWith(createExampleUrl())
  })

  it("performs a HTTP DELETE request according to the action metadata", () => {
    const { http, handler } = createMockActionHttp()
    handler(createExampleAction({ method: HttpMethod.DELETE }))
    expect(http.delete).toHaveBeenCalledWith(createExampleUrl())
  })

  it("dispatches an action after the response", done => {
    const { handler, httpResponse, store } = createMockActionHttp()

    handler(createExampleAction({ method: HttpMethod.GET }))

    setImmediate(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        createExampleAction({
          method: HttpMethod.GET,
          kind: HttpKind.RESPONSE,
          response: httpResponse,
        }),
      )

      done()
    })
  })

  function createMockActionHttp() {
    const httpResponse = { data: {} }

    const http = {
      get: createMockHttpFn(httpResponse),
      post: createMockHttpFn(httpResponse),
      patch: createMockHttpFn(httpResponse),
      delete: createMockHttpFn(httpResponse),
    }

    const store = createStore(identity)
    store.dispatch = jest.fn((action: Action) => null)

    const handler = actionHttp({ http, url: createExampleUrl() }, store)

    return { handler, http, httpResponse, store }
  }

  function createExampleAction(meta: Object) {
    return {
      type: "EXAMPLE_TABLE",
      meta: { kind: HttpKind.REQUEST, url: createExampleUrl(), ...meta },
    }
  }

  function createExampleUrl() {
    return "http://hostname.tld/"
  }

  function createMockHttpFn(res) {
    return jest.fn(() => Promise.resolve(res))
  }
})
