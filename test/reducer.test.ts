import { createReducer } from "../src/reducer"
import { HttpKind, HttpMethod } from "../src/http"

describe("createReducer", () => {
  it("takes postgrestOpts and returns a reducer", () => {
    const exampleOpts = { url: "http://example.tld" }
    const reducer = createReducer(exampleOpts)

    expect(reducer).toBeInstanceOf(Function)
  })

  it("ignores non-postgrest actions", () => {
    const exampleOpts = { url: "http://example.tld" }
    const reducer = createReducer(exampleOpts)

    expect(reducer({}, { type: "example_type" })).toEqual({})
  })

  it("ignores actions that do not match the api url", () => {
    const exampleOpts = { url: "http://example.tld" }
    const reducer = createReducer(exampleOpts)

    expect(
      reducer(
        {},
        {
          type: "examplsome_table",
          meta: {
            api: "http://other-example.tld",
            url: "http://other-example.tld/some_table",
            kind: HttpKind.RESPONSE,
            method: HttpMethod.GET,
          },
        },
      ),
    ).toEqual({})
  })

  it("ignores actions that are not http responses", () => {
    const exampleOpts = { url: "http://example.tld" }
    const reducer = createReducer(exampleOpts)

    expect(
      reducer(
        {},
        {
          type: "some_table",
          meta: {
            api: "http://example.tld",
            url: "http://example.tld/some_table",
            kind: HttpKind.REQUEST,
            method: HttpMethod.GET,
          },
        },
      ),
    ).toEqual({})
  })

  it("stores responses according to their HTTP method", () => {
    const exampleOpts = { url: "http://example.tld" }
    const reducer = createReducer(exampleOpts)
    const exampleResponse = {
      data: { example_key: "example_value" },
      status: 200,
      statusText: "ok",
      headers: {},
    }

    expect(
      reducer(
        {},
        {
          type: "some_table",
          meta: {
            api: "http://example.tld",
            url: "http://example.tld/some_table",
            kind: HttpKind.RESPONSE,
            method: HttpMethod.GET,
            response: exampleResponse,
          },
        },
      ),
    ).toEqual({
      some_table: {
        [HttpMethod.GET]: exampleResponse,
      },
    })
  })
})
