import { Action, applyMiddleware, combineReducers, createStore } from "redux"
import {
  HttpClient,
  HttpKind,
  HttpMethod,
  HttpRequestConfig,
} from "../src/http"
import { httpFetch } from "../src/httpFetch"
import connectPgRest from "../src/main"

describe("connectPgRest", () => {
  it("returns an object with a middleware and reducer", () => {
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
    const http = wrapHttp(res => {
      if (res.url.endsWith("/example_table")) {
        expect(store.getState().lastAction).toMatchObject({
          type: "example_table",
          meta: { kind: HttpKind.RESPONSE },
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
    const http = wrapHttp(res => {
      if (res.url.endsWith("3000")) {
        store.dispatch({ type: "example_table" })
      }

      if (res.url.endsWith("/example_table")) {
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

  it("provides a reducer that exposes the latest http resonses", done => {
    const http = wrapHttp(res => {
      if (res.url.endsWith("/example_table")) {
        expect(store.getState().api).toEqual({
          example_table: {
            [HttpMethod.GET]: {
              body: res.body,
              headers: res.headers,
              status: res.status,
              statusText: res.statusText,
            },
          },
        })

        done()
      }
    })

    const { middleware, reducer } = createExampleMiddleware(http)
    const reducers = combineReducers({ api: reducer })
    const store = createStore(reducers, applyMiddleware(middleware))
    store.dispatch({ type: "example_table" })
  })
})

function wrapHttp(fn: (res: Response) => any) {
  return (config: HttpRequestConfig) => {
    return httpFetch(config).then((res: Response) => {
      setImmediate(() => fn(res))
      return res
    })
  }
}

function createExampleMiddleware(http: HttpClient = httpFetch) {
  return connectPgRest({
    http,
    url: "http://localhost:3000",
  })
}

function createTestReducer() {
  return (state = { lastAction: {} as Action }, action: Action) => ({
    lastAction: action,
  })
}
