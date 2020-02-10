import addActionMeta from "../src/actionMeta"
import { HttpMethod, ActionKind } from "../src/main"

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
        method: HttpMethod.GET,
        kind: ActionKind.REQUEST,
      },
    })
  })

  it("does not override user provided metadata", () => {
    const exampleAction = {
      type: "EXAMPLE_TABLE",
      meta: { method: HttpMethod.POST, kind: ActionKind.RESPONSE },
    }
    expect(createExampleHandler()(exampleAction)).toEqual({
      ...exampleAction,
      meta: {
        method: HttpMethod.POST,
        kind: ActionKind.RESPONSE,
      },
    })
  })

  function createExampleHandler() {
    return addActionMeta({
      body: {
        paths: {
          "/": {},
          "/example_table": { get: {} },
        },
      },
    })
  }
})
