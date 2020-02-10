import connectPostgrest, { PostgrestOpts } from "../src/main"
import { HttpClient } from "../src/HttpClient"
import { PostgrestAction } from "../src/PostgrestAction"
import { ActionKind } from "../src/ActionKind"
import { HttpMethod } from "../src/HttpMethod"
import { createStore, applyMiddleware, Action, Reducer, Store } from "redux"

describe("connectPostgrest", () => {
  it("calls GET on the http client with the correct uri", () => {
    const mockHttp = createMockHttp((url: String) => Promise.resolve({}))

    createStoreWithPostgrest((state, action) => {}, {
      http: mockHttp,
      url: new URL("http://example.com/"),
    })

    expect(mockHttp.get).toHaveBeenCalledWith("http://example.com/")
  })

  it("does not pass actions until the request has completed", done => {
    const exampleReducer = jest.fn(() => {})

    const mockHttp = createMockHttp(
      (url: String) =>
        new Promise(res => {
          setImmediate(() => {
            expect(exampleReducer).toHaveBeenNthCalledWith(
              1,
              undefined,
              expect.any(Object),
            )
            expect(exampleReducer).toHaveBeenCalledTimes(1)
            res({})
            done()
          })
        }),
    )

    const store = createStoreWithPostgrest(exampleReducer, {
      http: mockHttp,
      url: new URL("http://example.com/"),
    })

    store.dispatch({ type: "EXAMPLE_TYPE" })
  })

  it("passes actions after the request has completed", done => {
    const exampleState = {}
    const exampleReducer = jest.fn(() => ({}))
    const exampleAction: Action = { type: "EXAMPLE_TYPE" }

    const mockHttp = createMockHttp(
      (url: String) =>
        new Promise(res => {
          setImmediate(() => {
            res({})

            setImmediate(() => {
              expect(exampleReducer).toHaveBeenNthCalledWith(
                2,
                exampleState,
                exampleAction,
              )
              done()
            })
          })
        }),
    )

    const store = createStoreWithPostgrest(exampleReducer, {
      http: mockHttp,
      url: new URL("http://example.com/"),
    })

    store.dispatch(exampleAction)
  })

  it("attaches default metadata to actions matching a documented endpoint", done => {
    const exampleState = {}
    const exampleReducer = jest.fn(() => ({}))
    const exampleAction: Action = { type: "EXAMPLE_TABLE" }
    const exampleApiBody = {
      paths: {
        "/": {},
        "/example_table": {},
      },
    }

    const mockHttp = createMockHttp(
      (url: String) =>
        new Promise(res => {
          setImmediate(() => {
            res(exampleApiBody)

            setImmediate(() => {
              expect(exampleReducer).toHaveBeenNthCalledWith(2, exampleState, {
                ...exampleAction,
                meta: expect.objectContaining({
                  method: "GET",
                  kind: "REQUEST",
                }),
              })
              done()
            })
          })
        }),
    )

    const store = createStoreWithPostgrest(exampleReducer, {
      http: mockHttp,
      url: new URL("http://example.com/"),
    })

    store.dispatch(exampleAction)
  })

  it("leaves existing metadata intact", done => {
    const exampleState = {}
    const exampleReducer = jest.fn(() => ({}))
    const exampleAction: PostgrestAction = {
      type: "EXAMPLE_TABLE",
      meta: {
        method: HttpMethod.GET,
        kind: ActionKind.REQUEST,
      },
    }

    const exampleApiBody = {
      paths: {
        "/": {},
        "/example_table": {},
      },
    }

    const mockHttp = createMockHttp(
      (url: String) =>
        new Promise(res => {
          setImmediate(() => {
            res(exampleApiBody)

            setImmediate(() => {
              expect(exampleReducer).toHaveBeenNthCalledWith(
                2,
                exampleState,
                exampleAction,
              )
              done()
            })
          })
        }),
    )

    const store = createStoreWithPostgrest(exampleReducer, {
      http: mockHttp,
      url: new URL("http://example.com/"),
    })

    store.dispatch(exampleAction)
  })

  function createMockHttp(onGet: (url: string) => Promise<Object>): HttpClient {
    return { get: jest.fn(onGet) }
  }

  function createStoreWithPostgrest(
    reducer: Reducer,
    opts: PostgrestOpts,
  ): Store {
    return createStore(reducer, applyMiddleware(connectPostgrest(opts)))
  }
})
