import Axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import connectPostgrest from "../src/main"
import { createStore, Action, applyMiddleware } from "redux"
import { HttpKind, HttpClient } from "../src/http"

describe("connectPostgrest", () => {
  it("returns an object with a middleware and router", () => {
    expect(createExampleMiddleware()).toEqual({
      middleware: expect.any(Function),
      reducer: expect.any(Function),
    })
  })

  it("passes actions while awaiting api root", () => {
    const { middleware } = createExampleMiddleware()
    const reducer = createTestReducer()
    const store = createStore(reducer, applyMiddleware(middleware))

    store.dispatch({ type: "example_action" })

    expect(store.getState().lastAction).toEqual({ type: "example_action" })
  })

  it("performs requests from actions queued before api root is loaded", done => {
    const http = wrapAxios(res => {
      if (res.config.url.endsWith("/example_table")) {
        expect(store.getState().lastAction).toMatchObject({
          type: "example_table",
          meta: {
            kind: HttpKind.RESPONSE,
          },
        })

        done()
      }
    })

    const { middleware } = createExampleMiddleware(http)
    const reducer = createTestReducer()
    const store = createStore(reducer, applyMiddleware(middleware))

    store.dispatch({ type: "example_table" })
  })

  it("performs requests from actions dispatched after api root is loaded", done => {
    const http = wrapAxios(res => {
      if (res.config.url.endsWith("3000")) {
        store.dispatch({ type: "example_table" })
      }

      if (res.config.url.endsWith("/example_table")) {
        expect(store.getState().lastAction).toMatchObject({
          type: "example_table",
          meta: {
            kind: HttpKind.RESPONSE,
          },
        })

        done()
      }
    })

    const { middleware } = createExampleMiddleware(http)
    const reducer = createTestReducer()
    const store = createStore(reducer, applyMiddleware(middleware))
  })
})

function wrapAxios(fn: (res: AxiosResponse) => any) {
  const invoker = (method: string) => (url: string) =>
    Axios[method](url).then((res: AxiosResponse) => {
      setImmediate(() => fn(res))
      return res
    })

  return {
    get: invoker("get"),
    post: invoker("post"),
    patch: invoker("patch"),
    delete: invoker("delete"),
  }
}

function createExampleMiddleware(http: HttpClient = Axios) {
  return connectPostgrest({
    http,
    url: "http://localhost:3000",
  })
}

function createTestReducer() {
  return (state = { lastAction: {} as Action }, action: Action) => ({
    lastAction: action,
  })
}
