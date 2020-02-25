import { identity } from "ramda"
import { Action, createStore } from "redux"
import actionHttp from "../src/actionHttp"
import { HttpKind, HttpMethod } from "../src/http"

describe("actionHttp", () => {
  it("performs a HTTP GET request according to the action metadata", () => {
    const { http, handler } = createMockActionHttp()
    handler(createExampleAction({ method: HttpMethod.GET }))
    expect(http).toHaveBeenCalledWith(
      expect.objectContaining({ method: "GET", url: createExampleUrl() }),
    )
  })

  it("performs a HTTP POST request according to the action metadata", () => {
    const { http, handler } = createMockActionHttp()
    handler(createExampleAction({ method: HttpMethod.POST, data: { k: "v" } }))
    expect(http).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        data: { k: "v" },
        url: createExampleUrl(),
      }),
    )
  })

  it("performs a HTTP PATCH request according to the action metadata", () => {
    const { http, handler } = createMockActionHttp()
    handler(createExampleAction({ method: HttpMethod.PATCH }))
    expect(http).toHaveBeenCalledWith(
      expect.objectContaining({ method: "PATCH", url: createExampleUrl() }),
    )
  })

  it("performs a HTTP DELETE request according to the action metadata", () => {
    const { http, handler } = createMockActionHttp()
    handler(createExampleAction({ method: HttpMethod.DELETE }))
    expect(http).toHaveBeenCalledWith(
      expect.objectContaining({ method: "DELETE", url: createExampleUrl() }),
    )
  })

  it("appends a query string", () => {
    const { http, handler } = createMockActionHttp()
    handler(createExampleAction({ method: HttpMethod.GET, query: "id=eq.1" }))
    expect(http).toHaveBeenCalledWith(
      expect.objectContaining({ url: createExampleUrl() + "?id=eq.1" }),
    )
  })

  it("parses a query string object", () => {
    const { http, handler } = createMockActionHttp()
    handler(
      createExampleAction({ method: HttpMethod.GET, query: { id: "eq.1" } }),
    )
    expect(http).toHaveBeenCalledWith(
      expect.objectContaining({ url: createExampleUrl() + "?id=eq.1" }),
    )
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
    const httpResponse = {
      data: {},
      status: 200,
      statusText: "ok",
      headers: {},
    }

    const http = jest.fn(() => Promise.resolve(httpResponse))

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
})
