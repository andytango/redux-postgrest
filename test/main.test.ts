import Axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import connectPostgrest from "../src/main"
import { createStore, Action, applyMiddleware } from "redux"

describe("connectPostgrest", () => {
  it("returns a middleware", () => {
    expect(
      connectPostgrest({ http: Axios, url: "http://localhost:3000" }),
    ).toBeInstanceOf(Function)
  })

  it.skip("passes actions", () => {
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

  it.skip("adds action metadata", done => {
    const http = wrapAxios(() => {
      expect(store.getState().lastAction).toMatchInlineSnapshot(`
      Object {
        "type": "example_table",
      }
    `)
      done()
    })

    const middleware = connectPostgrest({
      http,
      url: "http://localhost:3000",
    })

    const reducer = (state = { lastAction: {} }, action: Action) => ({
      lastAction: action,
    })

    const store = createStore(reducer, applyMiddleware(middleware))

    store.dispatch({ type: "example_table" })
  })
})

function wrapAxios(fn) {
  const invoker = method => (url: string) =>
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
