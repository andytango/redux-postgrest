import { HttpKind, HttpMethod } from "../src/http"
import { httpFetch } from "../src/httpFetch"
import { createReducer } from "../src/reducer"

describe("createReducer", () => {
  it("takes postgrestOpts and returns a reducer", () => {
    const reducer = createExampleReducer()

    expect(reducer).toBeInstanceOf(Function)
  })

  it("ignores non-postgrest actions", () => {
    const reducer = createExampleReducer()

    expect(reducer({}, { type: "example_type" })).toEqual({})
  })

  it("ignores actions that do not match the api url", () => {
    const reducer = createExampleReducer()

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
    const reducer = createExampleReducer()

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
    const reducer = createExampleReducer()
    const exampleResponseGet = {
      body: { example_key: "example_value" },
      status: 200,
      statusText: "ok",
      headers: {},
    }

    const exampleResponsePost = {
      body: { example_key: "example_value" },
      status: 201,
      statusText: "Created",
      headers: {},
    }

    const state1 = reducer(
      {},
      {
        type: "some_table",
        meta: {
          api: "http://example.tld",
          url: "http://example.tld/some_table",
          kind: HttpKind.RESPONSE,
          method: HttpMethod.GET,
          response: exampleResponseGet,
        },
      },
    )

    const state2 = reducer(state1, {
      type: "some_table",
      meta: {
        api: "http://example.tld",
        url: "http://example.tld/some_table",
        kind: HttpKind.RESPONSE,
        method: HttpMethod.POST,
        response: exampleResponsePost,
      },
    })

    expect(state1).toEqual({
      some_table: {
        [HttpMethod.GET]: exampleResponseGet,
      },
    })

    expect(state2).toEqual({
      some_table: {
        [HttpMethod.GET]: exampleResponseGet,
        [HttpMethod.POST]: exampleResponsePost,
      },
    })
  })
})

function createExampleReducer() {
  const exampleOpts = { url: "http://example.tld", http: httpFetch }
  return createReducer(exampleOpts)
}
