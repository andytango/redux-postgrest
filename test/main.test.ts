import connectPostgrest, { HttpClient } from "../src/main"
import {
  createStore,
  applyMiddleware,
  Action,
} from "redux"

describe("connectPostgrest", () => {
  it("calls GET on the http client with the correct uri", () => {
    const mockHttp: HttpClient = {
      get: jest.fn((url: String) => Promise.resolve({})),
    }

    createStore(
      (state, action) => {},
      applyMiddleware(
        connectPostgrest({
          http: mockHttp,
          url: new URL("http://example.com/"),
        }),
      ),
    )

    expect(mockHttp.get).toHaveBeenCalledWith("http://example.com/")
  })

  it("does not pass actions until the request has completed", done => {
    const mockHttp: HttpClient = {
      get: jest.fn(
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
      ),
    }

    const exampleState = {}
    const exampleReducer = jest.fn(() => exampleState)
    const exampleAction: Action = { type: "EXAMPLE_TYPE" }

    const store = createStore(
      exampleReducer,
      applyMiddleware(
        connectPostgrest({
          http: mockHttp,
          url: new URL("http://example.com/"),
        }),
      ),
    )

    store.dispatch(exampleAction)
  })

  it("does not pass actions until the request has completed", done => {
    const mockHttp: HttpClient = {
      get: jest.fn(
        (url: String) =>
          new Promise(res => {
            setImmediate(() => {
              res({})

              setImmediate(() => {
                expect(exampleReducer).toHaveBeenNthCalledWith(
                  1,
                  undefined,
                  expect.any(Object),
                )
                expect(exampleReducer).toHaveBeenNthCalledWith(
                  2,
                  exampleState,
                  exampleAction,
                )
                done()
              })
            })
          }),
      ),
    }

    const exampleState = {}
    const exampleReducer = jest.fn(() => exampleState)
    const exampleAction: Action = { type: "EXAMPLE_TYPE" }

    const store = createStore(
      exampleReducer,
      applyMiddleware(
        connectPostgrest({
          http: mockHttp,
          url: new URL("http://example.com/"),
        }),
      ),
    )

    store.dispatch(exampleAction)
  })
})
