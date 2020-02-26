import addActionMeta from "../src/actionMeta"
import { HttpKind, HttpMethod } from "../src/http"
import { httpFetch } from "../src/httpFetch"

describe("addActionMeta", () => {
  it("ignores non-postgrest actions", () => {
    const exampleAction = { type: "EXAMPLE_ACTION" }
    expect(createExampleHandler()(exampleAction)).toEqual(exampleAction)
  })

  it("adds default metadata for tables and views", () => {
    const exampleAction = { type: "EXAMPLE_TABLE" }
    expect(createExampleHandler()(exampleAction)).toEqual({
      ...exampleAction,
      meta: {
        api: "https://hostname.tld",
        method: HttpMethod.GET,
        url: "https://hostname.tld/example_table",
        kind: HttpKind.REQUEST,
      },
    })
  })

  it("adds default metadata for stored procedures", () => {
    const exampleAction = {
      type: "EXAMPLE_FN",
      payload: { example_param: "someText" },
    }

    expect(createExampleHandler()(exampleAction)).toEqual({
      ...exampleAction,
      meta: {
        api: "https://hostname.tld",
        method: HttpMethod.POST,
        url: "https://hostname.tld/rpc/example_fn",
        kind: HttpKind.REQUEST,
      },
      payload: { example_param: "someText" },
    })
  })

  it("does not override user provided metadata or params", () => {
    const exampleAction = {
      type: "EXAMPLE_TABLE",
      someKey: "someVal",
      meta: { method: HttpMethod.POST, kind: HttpKind.RESPONSE },
    }

    expect(createExampleHandler()(exampleAction)).toEqual({
      type: "EXAMPLE_TABLE",
      someKey: "someVal",
      meta: {
        api: "https://hostname.tld",
        method: HttpMethod.POST,
        url: "https://hostname.tld/example_table",
        kind: HttpKind.RESPONSE,
      },
    })
  })

  function createExampleHandler() {
    return addActionMeta(
      { url: "https://hostname.tld", http: httpFetch },
      {
        paths: {
          "/": {},
          "/example_table": { get: {} },
          "/rpc/example_fn": { post: {} },
        },
      },
    )
  }
})
