import {
  createPgRestActions,
  createPgRestActionGet,
  createPgRestActionPost,
  createPgRestActionPatch,
  createPgRestActionDelete,
} from "../src/actionCreators"

describe("createPgRestActions", () => {
  it("returns an object with all the action creators", () => {
    expect(createPgRestActions("example_table")).toEqual({
      get: expect.any(Function),
      post: expect.any(Function),
      patch: expect.any(Function),
      delete: expect.any(Function),
    })
  })

  it("returns action creators with the example_table", () => {
    const createAction = createPgRestActions("example_table")
    ;([
      ["get", createPgRestActionGet],
      ["post", createPgRestActionPost],
      ["patch", createPgRestActionPatch],
      ["delete", createPgRestActionDelete],
    ] as [string, Function][]).forEach(([key, fn]) => {
      expect(createAction[key]({ k: "v" }, { k2: "v2" })).toEqual(
        fn("example_table")({ k: "v" }, { k2: "v2" }),
      )
    })
  })
})

describe("createPgRestActionGet", () => {
  itReturnsActionCreator(createPgRestActionGet)

  it("takes a query argument", () => {
    expect(createPgRestActionGet("example_table")({ row_id: "eq.1" })).toEqual({
      type: "example_table",
      meta: { query: { row_id: "eq.1" } },
    })
  })

  it("merges the query argument with the optional meta argument", () => {
    expect(
      createPgRestActionGet("example_table")(
        { row_id: "eq.1" },
        { headers: { accept: "application/csv" }, query: {} },
      ),
    ).toEqual({
      type: "example_table",
      meta: { query: {}, headers: { accept: "application/csv" } },
    })
  })
})

describe("createPgRestActionPost", () => {
  itReturnsActionCreator(createPgRestActionPost)

  it("takes a body argument", () => {
    expect(
      createPgRestActionPost("example_table")({ content: "example_content" }),
    ).toEqual({
      type: "example_table",
      meta: { method: "POST", body: { content: "example_content" } },
    })
  })

  it("merges the body argument with the optional meta argument", () => {
    expect(
      createPgRestActionPost("example_table")(
        { content: "example_content" },
        { headers: { accept: "application/csv" }, body: {} },
      ),
    ).toEqual({
      type: "example_table",
      meta: {
        method: "POST",
        body: {},
        headers: { accept: "application/csv" },
      },
    })
  })
})

describe("createPgRestActionPatch", () => {
  itReturnsActionCreator(createPgRestActionPatch)

  it("takes a query and a body argument", () => {
    expect(
      createPgRestActionPatch("example_table")(
        { row_id: "eq.1" },
        { content: "example_content" },
      ),
    ).toEqual({
      type: "example_table",
      meta: {
        method: "PATCH",
        query: { row_id: "eq.1" },
        body: { content: "example_content" },
      },
    })
  })

  it("merges the body argument with the optional meta argument", () => {
    expect(
      createPgRestActionPatch("example_table")(
        { row_id: "eq.1" },
        { content: "example_content" },
        { headers: { accept: "application/csv" }, query: {}, body: {} },
      ),
    ).toEqual({
      type: "example_table",
      meta: {
        method: "PATCH",
        body: {},
        query: {},
        headers: { accept: "application/csv" },
      },
    })
  })
})

function itReturnsActionCreator(f: (type: string) => any) {
  it("returns an action creator", () => {
    expect(f("example_table")).toBeInstanceOf(Function)
    expect(f("example_table")()).toMatchObject({
      type: "example_table",
    })
  })
}
