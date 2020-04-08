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
          type: "example_table",
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

  it("sets initial loading state when a request is sent", () => {
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
    ).toMatchObject({
      some_table: {
        [HttpMethod.GET]: {
          url: "http://example.tld/some_table",
          loading: true,
        },
        [HttpMethod.POST]: null,
        [HttpMethod.PATCH]: null,
        [HttpMethod.DELETE]: null,
      },
    })
  })

  it("preserves old response when making a new request", () => {
    const reducer = createExampleReducer()

    const exampleResponse1 = {
      url: "http://example.tld/some_table",
      body: { example_key: "example_value" },
      status: 200,
      statusText: "ok",
      headers: {},
    }

    expect(
      reducer(
        {
          some_table: {
            [HttpMethod.GET]: exampleResponse1,
            [HttpMethod.POST]: null,
            [HttpMethod.PATCH]: null,
            [HttpMethod.DELETE]: null,
          },
        },
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
    ).toMatchObject({
      some_table: {
        [HttpMethod.POST]: null,
        [HttpMethod.PATCH]: null,
        [HttpMethod.DELETE]: null,
        [HttpMethod.GET]: {
          ...exampleResponse1,
          loading: true,
        },
      },
    })
  })

  it("stores responses according to their HTTP method", () => {
    const reducer = createExampleReducer()
    const exampleResponseGet = {
      url: "http://example.tld/some_table",
      body: { example_key: "example_value" },
      status: 200,
      statusText: "ok",
      headers: {},
    }

    const exampleResponsePost = {
      url: "http://example.tld/some_table",
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

    expect(state1).toMatchObject({
      some_table: {
        [HttpMethod.GET]: exampleResponseGet,
      },
    })

    expect(state2).toMatchObject({
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
