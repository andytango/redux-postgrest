import Axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import connectPostgrest from "../src/main"
import { createStore, Action, applyMiddleware } from "redux"
import { HttpKind } from "../src/http"

describe("connectPostgrest", () => {
  it("returns a middleware", () => {
    expect(
      connectPostgrest({ http: Axios, url: "http://localhost:3000" }),
    ).toBeInstanceOf(Function)
  })

  it("passes actions while awaiting api root", () => {
    const middleware = connectPostgrest({
      http: Axios,
      url: "http://localhost:3000",
    })

    const reducer = (state = { lastAction: {} }, action: Action) => ({
      lastAction: action,
    })

    const store = createStore(reducer, applyMiddleware(middleware))

    store.dispatch({ type: "example_action" })

    expect(store.getState().lastAction).toEqual({ type: "example_action" })
  })

  it("performs requests from queued actions after api root is loaded", done => {
    const http = wrapAxios(res => {
      if (res.config.url.endsWith("3000")) {
        expect(store.getState().lastAction).toEqual({
          type: "example_table",
        })
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

    const middleware = connectPostgrest({
      http,
      url: "http://localhost:3000",
    })

    const reducer = (state = { lastAction: {} as Action }, action: Action) => ({
      lastAction: action,
    })

    const store = createStore(reducer, applyMiddleware(middleware))

    store.dispatch({ type: "example_table" })
  })

  it("adds action metadata after api root has loaded", done => {
    const http = wrapAxios(res => {
      if (res.config.url.endsWith("3000")) {
        store.dispatch({ type: "example_table" })

        expect(store.getState().lastAction).toMatchObject({
          type: "example_table",
          meta: {
            kind: HttpKind.REQUEST,
          },
        })
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

    const middleware = connectPostgrest({
      http,
      url: "http://localhost:3000",
    })

    const reducer = (state = { lastAction: {} as Action }, action: Action) => ({
      lastAction: action,
    })

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
