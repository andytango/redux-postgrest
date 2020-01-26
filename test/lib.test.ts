import { isPostgrestAction } from "../src/lib"

describe("isPostgrestAction", () => {
  const exampleApiRoot = {
    loaded: true,
    body: { paths: { "/example_table": {} } },
  }

  it("returns true if action type matches a postgrest resource", () => {
    expect(
      isPostgrestAction({ type: "EXAMPLE_TABLE" }, exampleApiRoot),
    ).toEqual(true)
  })

  it("returns false if action type matches a postgrest resource", () => {
    expect(
      isPostgrestAction({ type: "EXAMPLE_OTHER" }, exampleApiRoot),
    ).toEqual(false)
  })
})
