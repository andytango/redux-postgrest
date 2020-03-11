import React from "react"
import { Provider } from "react-redux"
import TestRenderer from "react-test-renderer"
import { createStore, ActionCreator } from "redux"
import {
  makePgRestHooks,
  makePgRestHookGet,
  makePgRestHookPost,
  makePgRestHookPatch,
  makePgRestHookDelete,
} from "../src/hooks"
import {
  createPgRestActionPost,
  createPgRestActionGet,
  createPgRestActionPatch,
  createPgRestActionDelete,
} from "../src/actionCreators"

describe("makePgRestHooks", () => {
  it("takes a string and returns an object with hook creators", () => {
    expect(makePgRestHooks("example_type")).toEqual({
      get: expect.any(Function),
      post: expect.any(Function),
      patch: expect.any(Function),
      delete: expect.any(Function),
    })
  })

  it("returns correctly named hook fns", () => {
    const hooks = makePgRestHooks("example_type")
    ;["Get", "Post", "Patch", "Delete"].forEach(verb => {
      expect(hooks[verb.toLowerCase()]).toHaveProperty(
        "name",
        `usePgRest${verb}(example_type)`,
      )
    })
  })
})

describe("makePgRestHookGet", () => {
  it("takes a string returns a hook function", () => {
    expectHookFunction(makePgRestHookGet("example_type"))
  })

  it("returns a hook function that dispatches PgRest GET actions", () => {
    expectHookToDispatchAction(
      makePgRestHookGet("example_type"),
      createPgRestActionGet("example_type"),
      { id: "eq.1" },
    )
  })
})

describe("makePgRestHookPost", () => {
  it("takes a string returns a hook function", () => {
    expectHookFunction(makePgRestHookPost("example_type"))
  })

  it("returns a hook function that dispatches PgRest POST actions", () => {
    expectHookToDispatchAction(
      makePgRestHookPost("example_type"),
      createPgRestActionPost("example_type"),
      { content: "example_content" },
    )
  })
})

describe("makePgRestHookPost", () => {
  it("takes a string returns a hook function", () => {
    expectHookFunction(makePgRestHookPost("example_type"))
  })

  it("returns a hook function that dispatches PgRest POST actions", () => {
    expectHookToDispatchAction(
      makePgRestHookPost("example_type"),
      createPgRestActionPost("example_type"),
      { content: "example_content" },
    )
  })
})

describe("makePgRestHookPatch", () => {
  it("takes a string returns a hook function", () => {
    expectHookFunction(makePgRestHookPatch("example_type"))
  })

  it("returns a hook function that dispatches PgRest PATCH actions", () => {
    expectHookToDispatchAction(
      makePgRestHookPatch("example_type"),
      createPgRestActionPatch("example_type"),
      { id: "eq.1" },
      { content: "example_content" },
    )
  })
})

describe("makePgRestHookDelete", () => {
  it("takes a string returns a hook function", () => {
    expectHookFunction(makePgRestHookDelete("example_type"))
  })

  it("returns a hook function that dispatches PgRest DELETE actions", () => {
    expectHookToDispatchAction(
      makePgRestHookDelete("example_type"),
      createPgRestActionDelete("example_type"),
      { id: "eq.1" },
    )
  })
})

function expectHookFunction(fn: Function) {
  expect(fn).toBeInstanceOf(Function)
  expect(fn.name).toMatch(/^use/)
}

function expectHookToDispatchAction(
  useHookFn: Function,
  actionCreator: ActionCreator<any>,
  ...params: any[]
) {
  const store = createStore((_, action) => action)

  function Component() {
    const dispatch = useHookFn()
    dispatch(...params)
    return null
  }

  TestRenderer.create(
    <Provider store={store}>
      <Component />
    </Provider>,
  ).update()

  expect(store.getState()).toEqual(actionCreator(...params))
}
